import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
const schema=z.object({id:z.string().uuid(),status:z.enum(['confirmed','completed','cancelled'])});
export async function PATCH(request:Request){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});const {data:profile}=await supabase.from('profiles').select('role').eq('id',user.id).single();if(profile?.role!=='admin')return NextResponse.json({error:'Forbidden'},{status:403});let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:'Invalid update'},{status:400});}const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:'Invalid update'},{status:400});const admin=createAdminClient();const {error}=await admin.from('bookings').update({status:parsed.data.status,updated_at:new Date().toISOString()}).eq('id',parsed.data.id);if(error)return NextResponse.json({error:'Could not update booking.'},{status:500});return NextResponse.json({ok:true});}
