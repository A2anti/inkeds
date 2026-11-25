export const styles = [
  { name: 'Fine line', description: 'Delicate single-needle detail for florals, script and small symbols.', image: '/WhatsApp Image 2026-11-19 at 4.06.42 PM.jpeg' },
  { name: 'Minimalist', description: 'A few clean lines with a lot of space around them.', image: '/WhatsApp Image 2026-11-19 at 4.07.47 PM.jpeg' },
  { name: 'Blackwork', description: 'Solid black shapes, graphic forms and heavy contrast.', image: '/WhatsApp Image 2026-11-19 at 4.07.48 PM.jpeg' },
  { name: 'Realism', description: 'Portraits and objects with soft shading and depth.', image: '/WhatsApp Image 2026-11-19 at 4.07.49 PM.jpeg' },
  { name: 'Japanese', description: 'Waves, koi and dragons inspired by traditional irezumi.', image: '/WhatsApp Image 2026-11-19 at 4.06.42 PM(1).jpeg' },
  { name: 'Traditional', description: 'Bold outlines, iconic motifs and confident colour.', image: '/WhatsApp Image 2026-11-19 at 4.06.42 PM.jpeg' },
  { name: 'Tribal', description: 'Strong, curved shapes with expressive movement.', image: '/WhatsApp Image 2026-11-19 at 4.07.47 PM.jpeg' },
  { name: 'Lettering', description: 'Names, dates and quotes in custom hand-drawn type.', image: '/WhatsApp Image 2026-11-19 at 4.07.48 PM.jpeg' },
  { name: 'Geometric', description: 'Symmetry, dot work and considered sacred patterns.', image: '/WhatsApp Image 2026-11-19 at 4.07.49 PM.jpeg' },
  { name: 'Custom design', description: 'A one-of-one concept built around your story.', image: '/WhatsApp Image 2026-11-19 at 4.06.42 PM(1).jpeg' },
];
export const packages = [
  { name: 'Small tattoo', description: 'A single simple design up to 2 inches. Symbols, initials or a small flash piece.', price: 60 },
  { name: 'Name tattoo', description: 'Precision typography, cursive, gothic or micro-script custom lettering.', price: 125 },
  { name: '3 small tattoos', description: 'A bundle of three delicate fine-line or flash designs up to 2 inches each.', price: 150, popular: true },
  { name: 'Half neck', description: 'Side-neck, throat or nape placement crafted for your anatomy.', price: 200 },
  { name: 'Quarter sleeve', description: 'A focused upper arm, lower forearm or shoulder composition.', price: 250 },
  { name: 'Half sleeve', description: 'A comprehensive upper arm or forearm sleeve tailored to your contours.', price: 300, popular: true },
  { name: 'Full sleeve', description: 'A full-length arm composition, usually completed across multiple sessions.', price: 600 },
  { name: 'Back piece', description: 'A large-scale composition across the back, built over several sessions.', price: 900 },
];
export const gallery = [
  { title: 'Quiet detail', category: 'Fine line', image: '/WhatsApp Image 2026-11-19 at 4.06.42 PM.jpeg' },
  { title: 'Dark forms', category: 'Blackwork', image: '/WhatsApp Image 2026-11-19 at 4.07.47 PM.jpeg' },
  { title: 'Personal mark', category: 'Lettering', image: '/WhatsApp Image 2026-11-19 at 4.07.48 PM.jpeg' },
  { title: 'Soft realism', category: 'Realism', image: '/WhatsApp Image 2026-11-19 at 4.07.49 PM.jpeg' },
  { title: 'New classic', category: 'Traditional', image: '/WhatsApp Image 2026-11-19 at 4.06.42 PM(1).jpeg' },
  { title: 'Custom flow', category: 'Custom design', image: '/WhatsApp Image 2026-11-19 at 4.07.47 PM.jpeg' },
];
export const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
export const photo = (src: string) => (src.startsWith('/') ? src : `/${src}`);
