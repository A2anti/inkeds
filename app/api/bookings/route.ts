import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import { packages } from '@/lib/data';

export const runtime = 'nodejs';
const schema=z.object({name:z.string().trim().min(2).max(100),email:z.email().max(254),phone:z.string().trim().min(7).max(30),packageIds:z.array(z.number().int().min(0).max(packages.length-1)).min(1).max(8),style:z.string().max(80).optional().default(''),placement:z.string().max(120).optional().default(''),idea:z.string().max(3000).optional().default(''),appointmentDate:z.iso.date(),appointmentTime:z.enum(['11:00','14:00','17:00']),paymentMethod:z.string().trim().min(2).max(100)});
const allowedTypes=['image/jpeg','image/png','image/webp'];
export async function POST(request:Request){
 try{
  const form=await request.formData();const raw=form.get('booking');if(typeof raw!=='string')return NextResponse.json({error:'Booking details are missing.'},{status:400});
  let input:unknown;try{input=JSON.parse(raw)}catch{return NextResponse.json({error:'Booking details are invalid.'},{status:400})}
  const parsed=schema.safeParse(input);if(!parsed.success)return NextResponse.json({error:'Please check the booking details and try again.'},{status:400});
  const files=form.getAll('referenceImages').filter((f):f is File=>f instanceof File&&f.size>0);if(files.length>5)return NextResponse.json({error:'Upload a maximum of five reference images.'},{status:400});
  if(files.some(f=>!allowedTypes.includes(f.type)||f.size>5*1024*1024))return NextResponse.json({error:'Reference images must be JPG, PNG or WEBP files under 5MB each.'},{status:400});
  const v=parsed.data;const date=new Date(`${v.appointmentDate}T12:00:00`);const today=new Date();today.setHours(0,0,0,0);if(date<=today||date.getDay()<2||date.getDay()>6)return NextResponse.json({error:'Choose a future Tuesday to Saturday appointment.'},{status:400});
  const chosen=v.packageIds.map(i=>packages[i]);const total=chosen.reduce((n,p)=>n+p.price,0);const reference=`INK-${crypto.randomUUID().slice(0,8).toUpperCase()}`;const uploaded:string[]=[];
  if(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY){
   const supabase=createAdminClient();
   for(let i=0;i<files.length;i++){const file=files[i];const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp';const path=`${reference}/${crypto.randomUUID()}.${ext}`;const {error:uploadError}=await supabase.storage.from('booking-references').upload(path,Buffer.from(await file.arrayBuffer()),{contentType:file.type,upsert:false});if(uploadError){if(uploaded.length)await supabase.storage.from('booking-references').remove(uploaded);console.error('Reference upload failed:',uploadError.message);return NextResponse.json({error:'We could not upload your reference images. Please try again.'},{status:500});}uploaded.push(path);}
   const {error}=await supabase.from('bookings').insert({reference,customer_name:v.name,email:v.email,phone:v.phone,packages:chosen.map(p=>({name:p.name,price:p.price})),style:v.style||null,placement:v.placement||null,idea:v.idea||null,appointment_date:v.appointmentDate,appointment_time:v.appointmentTime,total_amount:total,deposit_amount:total/2,balance_amount:total/2,payment_method:v.paymentMethod,reference_images:uploaded,status:'pending'});
   if(error){if(uploaded.length)await supabase.storage.from('booking-references').remove(uploaded);if(error.code==='23505')return NextResponse.json({error:'That appointment time has just been taken. Please choose another slot.'},{status:409});console.error('Booking insert failed:',error.message);return NextResponse.json({error:'We could not save your request right now. Please try again shortly.'},{status:500});}
  }else{
   console.warn('Supabase env vars not configured; skipping database persistence for booking',reference);
  }
  if(process.env.RESEND_API_KEY&&process.env.BOOKING_NOTIFICATION_EMAIL){try{const resend=new Resend(process.env.RESEND_API_KEY);await resend.emails.send({from:process.env.BOOKING_FROM_EMAIL||'INKED. <onboarding@resend.dev>',to:process.env.BOOKING_NOTIFICATION_EMAIL,subject:`New booking request ${reference}`,html:`<h2>New INKED. booking request</h2><p><b>${v.name}</b> · ${v.email} · ${v.phone}</p><p>${v.appointmentDate} at ${v.appointmentTime}</p><p>${chosen.map(p=>p.name).join(', ')}</p><p>Total: $${total} · Deposit: $${total/2}</p><p>Style: ${v.style||'Not specified'} · Placement: ${v.placement||'Not specified'}</p><p>Preferred payment: ${v.paymentMethod}</p><p>Reference image files: ${uploaded.length}</p><p>${v.idea||''}</p>`});}catch(e){console.error('Booking email failed:',e);}}
  return NextResponse.json({ok:true,reference});
 }catch(e){console.error(e);return NextResponse.json({error:'Unexpected server error.'},{status:500});}
}
