async function run() {
  try {
    const res = await fetch('https://voltariaglobal.com/products/fans');
    const html = await res.text();
    console.log("Includes updated text?", html.includes('56" AC CEILING FAN') || html.includes('56&quot; AC CEILING FAN'));
    console.log("Includes original text?", html.includes('Voltaria AeroBreeze Ceiling Fan'));
  } catch (e) {
    console.error(e);
  }
}
run();
