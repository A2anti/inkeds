export const styles = [
  { name: 'Fine line', description: 'Delicate single-needle detail for florals, script and small symbols.', image: 'photo-1611501275019-9b5cda994e8d' },
  { name: 'Minimalist', description: 'A few clean lines with a lot of space around them.', image: 'photo-1590246814883-57c9f7f9f6b5' },
  { name: 'Blackwork', description: 'Solid black shapes, graphic forms and heavy contrast.', image: 'photo-1565058379802-bbe93b2f703a' },
  { name: 'Realism', description: 'Portraits and objects with soft shading and depth.', image: 'photo-1598371839696-5c5bb00bdc28' },
  { name: 'Japanese', description: 'Waves, koi and dragons inspired by traditional irezumi.', image: 'photo-1612459284970-e8b3e3c8b7f4' },
  { name: 'Traditional', description: 'Bold outlines, iconic motifs and confident colour.', image: 'photo-1599685315640-7ec3b7d5b0e2' },
  { name: 'Tribal', description: 'Strong, curved shapes with expressive movement.', image: 'photo-1562962230-16e4623d36e6' },
  { name: 'Lettering', description: 'Names, dates and quotes in custom hand-drawn type.', image: 'photo-1611846262398-6c7c6c3c9e4b' },
  { name: 'Geometric', description: 'Symmetry, dot work and considered sacred patterns.', image: 'photo-1590246814883-57c9f7f9f6b5' },
  { name: 'Custom design', description: 'A one-of-one concept built around your story.', image: 'photo-1565058379802-bbe93b2f703a' },
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
  { title: 'Quiet detail', category: 'Fine line', image: 'photo-1611501275019-9b5cda994e8d' },
  { title: 'Dark forms', category: 'Blackwork', image: 'photo-1565058379802-bbe93b2f703a' },
  { title: 'Personal mark', category: 'Lettering', image: 'photo-1611846262398-6c7c6c3c9e4b' },
  { title: 'Soft realism', category: 'Realism', image: 'photo-1598371839696-5c5bb00bdc28' },
  { title: 'New classic', category: 'Traditional', image: 'photo-1599685315640-7ec3b7d5b0e2' },
  { title: 'Custom flow', category: 'Custom design', image: 'photo-1562962230-16e4623d36e6' },
];
export const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
export const photo = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
