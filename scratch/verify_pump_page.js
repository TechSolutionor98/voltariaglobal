async function verify() {
  try {
    const res = await fetch('http://localhost:3000/products/solar-water-pump');
    const html = await res.text();
    console.log('HTTP Status:', res.status);
    console.log('HTML Length:', html.length);
    console.log('Has Banner:', html.includes('solar-water-pump-bg.png'));
    console.log('Has Model:', html.includes('VSP30-S900W/96V'));
    console.log('Has Product Name:', html.includes('Voltaria VSP30-S900W/96V DC Solar Water Pump'));
    console.log('Has Pure Copper:', html.includes('100% Pure Copper'));
    console.log('Has 30m3/h:', html.includes('30m³/h'));
    console.log('Has Image:', html.includes('dc-solar-water-pump.png'));
    console.log('Has Quote Link:', html.includes('contact?inquiry='));
    console.log('Has Navbar Link:', html.includes('/products/solar-water-pump'));
    
    // Also test homepage navbar and footer
    const homeRes = await fetch('http://localhost:3000/');
    const homeHtml = await homeRes.text();
    console.log('Homepage Has Solar Water Pump in Navbar:', homeHtml.includes('/products/solar-water-pump'));
    console.log('Homepage Has Solar Water Pump in Services:', homeHtml.includes('DC SOLAR WATER PUMP'));

    // Also test products index page
    const productsRes = await fetch('http://localhost:3000/products');
    const productsHtml = await productsRes.text();
    console.log('Products Index Has Solar Water Pump:', productsHtml.includes('/products/solar-water-pump'));

  } catch (err) {
    console.error('Verification failed:', err);
  }
}

verify();
