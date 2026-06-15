import fs from 'fs';
import path from 'path';

// Dynamically reference fs methods to prevent Next.js Node File Trace (NFT) from scanning and bundling the entire workspace.
const getFsMethod = (name) => fs[name];
const existsSync = getFsMethod(['exists', 'Sync'].join(''));
const readFileSync = getFsMethod(['read', 'File', 'Sync'].join(''));
const writeFileSync = getFsMethod(['write', 'File', 'Sync'].join(''));
const statSync = getFsMethod(['stat', 'Sync'].join(''));

function resolveImportPath(importPath, currentFilePath) {
  if (importPath.startsWith('@/')) {
    const useSrc = existsSync(path.join(process.cwd(), 'src'));
    return path.join(process.cwd(), importPath.replace('@/', useSrc ? 'src/' : ''));
  }
  if (importPath.startsWith('.') || importPath.startsWith('..')) {
    return path.resolve(path.dirname(currentFilePath), importPath);
  }
  return null;
}

function findFile(resolvedPath) {
  const extensions = ['.js', '.jsx', '.tsx', '.ts'];
  if (!resolvedPath) return null;
  if (existsSync(resolvedPath) && statSync(resolvedPath).isFile()) {
    return resolvedPath;
  }
  for (const ext of extensions) {
    if (existsSync(resolvedPath + ext)) {
      return resolvedPath + ext;
    }
    if (existsSync(path.join(resolvedPath, 'index' + ext))) {
      return path.join(resolvedPath, 'index' + ext);
    }
  }
  return null;
}

function cleanText(text) {
  // Strip JSX comments {/* ... */}
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  // Strip HTML/JSX tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Strip JSX curly braces around string literals
  text = text.replace(/\{"([\s\S]*?)"\}/g, '$1');
  text = text.replace(/\{'([\s\S]*?)'\}/g, '$1');
  // Extract default text from {var || "default"} patterns
  text = text.replace(/\{[^}]*\|\|\s*"([^"]+)"\s*\}/g, '$1');
  text = text.replace(/\{[^}]*\|\|\s*'([^']+)'\s*\}/g, '$1');
  // Strip remaining curly braces and variables (e.g. {icon1})
  text = text.replace(/\{[\s\S]*?\}/g, '');
  // Clean whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// Centrally identify code structures, SVG paths, viewBox configs, Tailwind arrays, or framework links to exclude them from the CMS.
function isCodeOrStyleString(val) {
  const trimmed = val.trim();
  
  // 1. Skip React/Next directives, code expressions, template variables, and packages
  if (trimmed === 'use client' || trimmed === 'use server' || trimmed.includes('${') || trimmed.startsWith('next/') || trimmed.startsWith('react')) {
    return true;
  }
  
  // 2. Skip file paths (but KEEP /images/ since we want to treat them as images, unless they are code files)
  if (trimmed.startsWith('@/') || trimmed.startsWith('./') || trimmed.startsWith('../') || (trimmed.endsWith('.ts') || trimmed.endsWith('.tsx') || trimmed.endsWith('.js') || trimmed.endsWith('.jsx') || trimmed.endsWith('.css'))) {
    return true;
  }

  // 3. Skip system anchors, classes, or IDs without spaces
  if (trimmed.startsWith('#') && !trimmed.includes(' ')) {
    return true;
  }

  // 4. Skip technical keywords (lowercase alphanumeric with dashes/underscores, no spaces)
  if (!trimmed.includes(' ')) {
    if (/^[a-z0-9_\-]+$/.test(trimmed) && trimmed.length > 2) {
      const isStyleWord = /^(flex|grid|block|inline|hidden|absolute|relative|static|fixed|sticky|group|pointer|select|truncate|transition|duration|ease|delay|cursor|overflow|aspect|w-auto|h-auto|antialiased|font-sans|object-cover|object-contain|object-fill|object-center|cursor-pointer|min-h-screen)$/i.test(trimmed);
      const hasDash = trimmed.includes('-');
      const isAllLowercase = /^[a-z0-9_\-]+$/.test(trimmed);
      if (isStyleWord || (isAllLowercase && hasDash)) {
        return true;
      }
    }
  }

  // 5. Skip fallback loading and initialization messages
  if (trimmed.toLowerCase().includes('loading') || trimmed.toLowerCase().includes('initializing') || trimmed.endsWith('...')) {
    return true;
  }

  // 5.1. Skip coordinates and decimal numbers
  if (/^[0-9\.\s,%]+$/.test(trimmed)) {
    return true;
  }

  // 5.2. Skip colon modifiers on single-word classes (e.g., lg:col-span-4)
  if (!trimmed.includes(' ') && trimmed.includes(':')) {
    return true;
  }
  
  // 6. Skip SVG path syntax, viewBoxes, and pure space-separated coordinates
  const svgPathRegex = /^[0-9\s,\.\-eMLHVCSQTAZmlhvcsqtaz]*$/;
  if (svgPathRegex.test(trimmed) && (trimmed.includes(' ') || /[a-zA-Z]/.test(trimmed)) && trimmed.length > 3) {
    return true;
  }

  // 7. Skip responsive image sizes, viewport dimensions, or CSS length lists
  if (/(vw|vh|px|rem|em|%)/i.test(trimmed)) {
    if (/^(max-w|min-w|screen|\d|\s|\(|\)|px|vw|vh|rem|em|%|,|:)+$/i.test(trimmed)) {
      return true;
    }
  }

  // 8. Skip Tailwind utility classes (if the string is a sequence of styling classes)
  if (trimmed.includes(' ')) {
    const tokens = trimmed.split(/[\s,]+/);
    const styleClassRegex = /^(bg|text|px|py|p|pt|pb|pl|pr|m|mt|mb|ml|mr|mx|my|w|h|border|rounded|shadow|gap|col|row|translate|scale|opacity|duration|ease|font|tracking|leading|items|justify|overflow|pointer|select|flex|grid|min-h|max-h|min-w|max-w|aspect|z|from|via|to|delay|origin|cursor|fill|stroke|space|animate|object|group-hover|hover|focus|active|top|bottom|left|right|inset|self|transition|decoration|line-clamp|divide|ring|backdrop|filter|mix-blend|shrink|grow|order)-[a-z0-9]/i;
    const styleWordRegex = /^(flex|grid|block|inline|hidden|absolute|relative|static|fixed|sticky|group|pointer|select|truncate|transition|duration|ease|delay|cursor|overflow|aspect|antialiased|font-sans|container|mx-auto|w-full|h-full|max-w-none)$/i;
    
    let styleCount = 0;
    for (const t of tokens) {
      const cleanToken = t.trim();
      if (!cleanToken) continue;
      if (
        cleanToken.includes(':') || 
        cleanToken.includes('vw') || 
        cleanToken.includes('vh') || 
        cleanToken.includes('px') || 
        cleanToken.startsWith('(') || 
        cleanToken.endsWith(')') || 
        /^\d+(vw|vh|px|%|em|rem|fr)?$/i.test(cleanToken) ||
        styleClassRegex.test(cleanToken) || 
        styleWordRegex.test(cleanToken)
      ) {
        styleCount++;
      }
    }
    
    if (styleCount / tokens.length > 0.3) {
      return true;
    }
  }

  return false;
}

/**
 * Recursively parses a page file and its local imports to extract static text content and images.
 * Groups findings into sections based on the components they were found in.
 * 
 * @param {string} pageFilePath - Absolute path to the page file
 * @returns {Array} List of sections suitable for cms_page_content
 */
export function parsePageContent(pageFilePath) {
  const sections = [];
  const visited = new Set();

  function parseFile(filePath, componentName) {
    if (visited.has(filePath)) return;
    visited.add(filePath);

    if (!existsSync(filePath)) return;
    const rawContent = readFileSync(filePath, 'utf-8');
    // Strip comments to ignore commented-out code
    const content = rawContent.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');

    const sectionFields = {};

    // First, scan for t(...) calls representing explicit user-facing localizable strings
    const tRegex = /\bt\(\s*(['"`])((?:[^\\]|\\.)*?)\1\s*\)/g;
    let match;
    let tIdx = 1;
    const tMatches = [];
    while ((match = tRegex.exec(content)) !== null) {
      tMatches.push(match);
    }

    if (tMatches.length > 0) {
      for (const tMatch of tMatches) {
        const val = tMatch[2].trim();
        if (val && val.length > 1) {
          const isDuplicate = Object.values(sectionFields).some(f => f.originalValue === val);
          if (isDuplicate) continue;

          const isImageExt = /\.(png|jpe?g|webp|gif|svg|avif|ico)$/i.test(val);
          const isImgPath = val.startsWith('/images/') || val.startsWith('/img/') || val.startsWith('/assets/');
          const isImage = isImageExt || isImgPath || (val.startsWith('http') && /\.(png|jpe?g|webp|gif|svg|avif|ico)/i.test(val));

          if (isImage) {
            const fieldKey = `t_image_${tIdx++}`;
            sectionFields[fieldKey] = {
              type: 'image',
              value: val,
              originalValue: val,
              label: `Image: "${val.substring(0, 30)}${val.length > 30 ? '...' : ''}"`
            };
          } else {
            const fieldKey = `t_text_${tIdx++}`;
            const isLong = val.length > 80;
            sectionFields[fieldKey] = {
              type: isLong ? 'richtext' : 'text',
              value: val,
              originalValue: val,
              label: `Text: "${val.substring(0, 30)}${val.length > 30 ? '...' : ''}"`
            };
          }
        }
      }
    } else {
      // Fallback: Scan JSX tags for plain static texts (including spans, divs, list items, etc.)
      const jsxTagRegex = /<(h[1-6]|p|span|li|td|div|a|blockquote|button|strong|em|b|i|small)\b([^>]*)>([^<]*?)<\/\1>/gi;
      let textIdx = 1;
      while ((match = jsxTagRegex.exec(content)) !== null) {
        const tag = match[1].toLowerCase();
        const innerContent = match[3];

        // Skip container tags that contain child tags or dynamic JSX curly expressions
        if (innerContent.includes('<') || innerContent.includes('{')) {
          continue;
        }

        const text = cleanText(innerContent);
        if (text && text.length > 1) {
          if (isCodeOrStyleString(text)) continue;

          // Check duplicate to avoid adding the same value multiple times
          const isDuplicate = Object.values(sectionFields).some(f => f.originalValue === text);
          if (isDuplicate) continue;

          const fieldKey = `text_${tag}_${textIdx++}`;
          const isLong = text.length > 80;
          
          let label = '';
          const clean = text.substring(0, 30) + (text.length > 30 ? '...' : '');
          if (tag.startsWith('h')) {
            label = `Heading <${tag}>: "${clean}"`;
          } else if (tag === 'p' || tag === 'blockquote') {
            label = `Paragraph: "${clean}"`;
          } else {
            label = `Text <${tag}>: "${clean}"`;
          }

          sectionFields[fieldKey] = {
            type: (tag === 'p' || tag === 'blockquote' || isLong) ? 'richtext' : 'text',
            value: text,
            originalValue: text,
            tag: tag.startsWith('h') ? tag : undefined,
            label: label
          };
        }
      }

      // Fallback: Scan JS object string properties (e.g. inside lists, reason arrays, product specs)
      let jsIdx = 1;
      const jsPropRegex = /\b(title|description|text|tag|heading|subheading|paragraph|content|caption|placeholder|address|phone|email|label|name)\s*:\s*(?:['"]([^'"]+)['"]|`([^`]+)`)/g;
      while ((match = jsPropRegex.exec(content)) !== null) {
        const key = match[1];
        const val = (match[2] || match[3] || '').trim();
        if (val && val.length > 1) {
          if (isCodeOrStyleString(val)) continue;

          // Check duplicate
          const isDuplicate = Object.values(sectionFields).some(f => f.originalValue === val);
          if (isDuplicate) continue;

          const fieldKey = `js_${key}_${jsIdx++}`;
          const isLong = val.length > 80;
          sectionFields[fieldKey] = {
            type: isLong ? 'richtext' : 'text',
            value: val,
            originalValue: val,
            label: `Data (${key}): "${val.substring(0, 30)}${val.length > 30 ? '...' : ''}"`
          };
        }
      }

      // Fallback: Scan all general string literals in the file (to catch features, specifications, list items, etc.)
      let strIdx = 1;
      const strRegex = /(['"`])((?:[^\\]|\\.)*?)\1/g;
      let strMatch;
      while ((strMatch = strRegex.exec(content)) !== null) {
        const val = strMatch[2].trim();
        
        // Skip short strings and styling/code constructs
        if (val.length < 3) continue;
        if (isCodeOrStyleString(val)) continue;

        // Check duplicate
        const isDuplicate = Object.values(sectionFields).some(f => f.originalValue === val);
        if (isDuplicate) continue;

        const fieldKey = `js_str_${strIdx++}`;
        const isImageExt = /\.(png|jpe?g|webp|gif|svg|avif|ico)$/i.test(val);
        const isImgPath = val.startsWith('/images/') || val.startsWith('/img/') || val.startsWith('/assets/');
        const isImage = isImageExt || isImgPath || (val.startsWith('http') && /\.(png|jpe?g|webp|gif|svg|avif|ico)/i.test(val));

        if (isImage) {
          sectionFields[fieldKey] = {
            type: 'image',
            value: val,
            originalValue: val,
            label: `Image: "${val.substring(0, 30)}${val.length > 30 ? '...' : ''}"`
          };
        } else {
          const isLong = val.length > 80;
          sectionFields[fieldKey] = {
            type: isLong ? 'richtext' : 'text',
            value: val,
            originalValue: val,
            label: `Data String: "${val.substring(0, 30)}${val.length > 30 ? '...' : ''}"`
          };
        }
      }
    }

    // 3. Scan for images (imports, constants, and inline JSX)
    const imgImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+\.(?:png|jpe?g|webp|gif|svg|avif))['"]/gi;
    while ((match = imgImportRegex.exec(content)) !== null) {
      const varName = match[1];
      const impPath = match[2];
      const fieldKey = `image_${varName.toLowerCase()}`;
      
      if (sectionFields[fieldKey]) continue;

      sectionFields[fieldKey] = {
        type: 'image',
        value: impPath,
        originalValue: impPath,
        varName: varName,
        isImport: true,
        label: `Image (${varName})`,
      };
    }

    const imgConstRegex = /const\s+(\w+)\s*=\s*\{\s*[^}]*src:\s*['"]([^'"]+)['"][^}]*\};?/gi;
    while ((match = imgConstRegex.exec(content)) !== null) {
      const varName = match[1];
      const srcPath = match[2];
      const fieldKey = `image_${varName.toLowerCase()}`;
      
      if (sectionFields[fieldKey]) continue;

      sectionFields[fieldKey] = {
        type: 'image',
        value: srcPath,
        originalValue: srcPath,
        varName: varName,
        isImport: true,
        label: `Image (${varName})`,
      };
    }

    const inlineImgRegex = /<(?:img|Image)[^>]*src=['"]([^'"]+)['"]/gi;
    let imgIdx = 1;
    while ((match = inlineImgRegex.exec(content)) !== null) {
      const srcPath = match[1];
      if (srcPath.startsWith('{')) continue;
      const fieldKey = `inline_image_${imgIdx++}`;
      sectionFields[fieldKey] = {
        type: 'image',
        value: srcPath,
        originalValue: srcPath,
        isInline: true,
        label: `Inline Image ${imgIdx - 1}`,
      };
    }

    // 3.5. Scan JS object image properties (e.g. image: '/images/...')
    let jsImgIdx = 1;
    const jsImgPropRegex = /\b(image|img|logo|src|thumbnail|banner|icon)\s*:\s*['"]([^'"]+)['"]/gi;
    while ((match = jsImgPropRegex.exec(content)) !== null) {
      const key = match[1].toLowerCase();
      const val = match[2].trim();
      
      if (val && val.length > 1) {
        const isImageExt = /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(val);
        const isExternalUrl = /^https?:\/\//i.test(val);
        
        if (isImageExt || isExternalUrl || val.startsWith('/images/')) {
          const fieldKey = `js_image_${key}_${jsImgIdx++}`;
          
          if (sectionFields[fieldKey]) continue;
          
          sectionFields[fieldKey] = {
            type: 'image',
            value: val,
            originalValue: val,
            label: `Image (${key})`,
            isJsImage: true,
            jsKey: key
          };
        }
      }
    }

    // If we found any fields, add the section
    if (Object.keys(sectionFields).length > 0) {
      // Sort fields by their visual appearance position in the file code
      const sortedFields = {};
      const lastIndices = {};
      Object.entries(sectionFields)
        .map(([key, field]) => {
          const searchVal = field.originalValue;
          const startSearchPos = lastIndices[searchVal] !== undefined ? lastIndices[searchVal] + 1 : 0;
          let idx = content.indexOf(searchVal, startSearchPos);
          if (idx === -1) {
            idx = content.indexOf(searchVal);
          }
          if (idx !== -1) {
            lastIndices[searchVal] = idx;
          }
          return { key, field: { ...field, index: idx === -1 ? Infinity : idx } };
        })
        .sort((a, b) => a.field.index - b.field.index)
        .forEach(({ key, field }) => {
          const { index, ...rest } = field;
          sortedFields[key] = rest;
        });

      const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
      sections.push({
        sectionId: componentName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        sectionName: componentName,
        filePath: relativePath,
        order: sections.length + 1,
        fields: sortedFields,
      });
    }

    // Find local imports in this file using dynamically constructed regex to bypass static bundler AST tracing
    const importRegex = new RegExp('import' + '\\s+(\\w+)\\s+from\\s+[\'\"]([^\'\"]+)[\'\"]', 'g');
    const imports = [];
    while ((match = importRegex.exec(content)) !== null) {
      const name = match[1];
      const impPath = match[2];
      
      if (impPath.startsWith('.') || impPath.startsWith('@/')) {
        const resolved = resolveImportPath(impPath, filePath);
        const actualFile = findFile(resolved);
        if (actualFile && !actualFile.includes('node_modules') && !actualFile.includes('.next')) {
          imports.push({ name, file: actualFile });
        }
      }
    }

    // Find dynamic imports (e.g. const Name = dynamic(() => import('...')))
    const dynamicImportRegex = new RegExp('(?:const|let|var)\\s+(\\w+)\\s*=\\s*(?:dynamic\\(\\s*\\(\\s*\\)\\s*=>\\s*)?' + 'import' + '\\(\\s*[\'\"]([^\'\"]+)[\'\"]\\s*\\)', 'g');
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      const name = match[1];
      const impPath = match[2];
      
      if (impPath.startsWith('.') || impPath.startsWith('@/')) {
        const resolved = resolveImportPath(impPath, filePath);
        const actualFile = findFile(resolved);
        if (actualFile && !actualFile.includes('node_modules') && !actualFile.includes('.next')) {
          if (!imports.some(imp => imp.file === actualFile)) {
            imports.push({ name, file: actualFile });
          }
        }
      }
    }

    // Recurse into imported files
    for (const imp of imports) {
      const lowerName = imp.name.toLowerCase();
      if (lowerName === 'navbar' || lowerName === 'footer') {
        continue;
      }
      parseFile(imp.file, imp.name);
    }
  }

  // Start with the page file
  const baseComponentName = path.basename(pageFilePath, path.extname(pageFilePath));
  const entryComponentName = baseComponentName === 'page' ? 'Page Content' : baseComponentName;
  parseFile(pageFilePath, entryComponentName);

  // Sort sections by their appearance order in the entry page file
  try {
    const entryFileContent = readFileSync(pageFilePath, 'utf-8');
    const cleanEntryContent = entryFileContent.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
    const positions = {};

    for (const section of sections) {
      const name = section.sectionName;
      if (name === entryComponentName) {
        const regex = /<(h[1-4]|p|img|Image)\b/i;
        const match = regex.exec(cleanEntryContent);
        positions[name] = match ? match.index : 0;
      } else {
        const regex = new RegExp(`<${name}\\b`);
        const match = regex.exec(cleanEntryContent);
        positions[name] = match ? match.index : Infinity;
      }
    }

    sections.sort((a, b) => {
      const posA = positions[a.sectionName] !== undefined ? positions[a.sectionName] : Infinity;
      const posB = positions[b.sectionName] !== undefined ? positions[b.sectionName] : Infinity;
      return posA - posB;
    });

    // Reset order sequencing based on sorted order
    sections.forEach((s, idx) => {
      s.order = idx + 1;
    });
  } catch (sortErr) {
    console.error('Failed to sort sections by visual order:', sortErr);
  }

  return sections;
}

/**
 * Updates page JSX files on disk by replacing original static texts and images with their edited CMS values.
 * 
 * @param {Array} sections - The sections array containing fields and files to update
 */
export function updatePageFiles(sections) {
  for (const section of sections) {
    if (!section.filePath) continue;
    const absolutePath = path.join(process.cwd(), section.filePath);
    if (!existsSync(absolutePath)) {
      console.warn(`File not found: ${absolutePath}`);
      continue;
    }

    let fileContent = readFileSync(absolutePath, 'utf-8');
    let contentChanged = false;
    let freshParsedSec = null;

    function getFreshOriginalValue(fieldKey) {
      if (!freshParsedSec) {
        try {
          const parsedList = parsePageContent(absolutePath);
          freshParsedSec = parsedList.find(
            s => s.sectionId === section.sectionId || 
                 s.sectionName?.toLowerCase() === section.sectionName?.toLowerCase()
          );
        } catch (err) {
          console.error('Failed to parse file for fallback:', err);
        }
      }
      return freshParsedSec?.fields?.[fieldKey]?.originalValue;
    }

    for (const [fieldKey, field] of Object.entries(section.fields || {})) {
      const { value, originalValue, type, isImport, varName, isInline, isJsImage, jsKey } = field;

      if (originalValue === undefined || originalValue === null) continue;

      // Check current value on disk. If it's already equal to value, skip!
      const freshVal = getFreshOriginalValue(fieldKey);
      if (freshVal !== undefined && freshVal !== null && value === freshVal) {
        continue;
      }

      if (type === 'image') {
        if (isImport && varName) {
          // Replace standard import with a constant declaration
          const importRegex = new RegExp(`import\\s+${varName}\\s+from\\s+['"][^'"]+['"];?`, 'g');
          if (importRegex.test(fileContent)) {
            fileContent = fileContent.replace(importRegex, `const ${varName} = { src: '${value}', height: 1000, width: 1000 };`);
            contentChanged = true;
          } else {
            // If already replaced with constant, update the constant
            const constRegex = new RegExp(`const\\s+${varName}\\s*=\\s*\\{[^}]*src:\\s*['"][^'"]+['"][^}]*\\};?`, 'g');
            if (constRegex.test(fileContent)) {
              fileContent = fileContent.replace(constRegex, `const ${varName} = { src: '${value}', height: 1000, width: 1000 };`);
              contentChanged = true;
            }
          }
        } else if (isInline) {
          // Replace inline image path using current path on disk (freshVal) or fallback to originalValue
          const searchImage = freshVal || originalValue;
          const escaped = searchImage.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const srcRegex = new RegExp(`src=['"]${escaped}['"]`, 'g');
          if (srcRegex.test(fileContent)) {
            fileContent = fileContent.replace(srcRegex, `src="${value}"`);
            contentChanged = true;
          }
        } else if (isJsImage && jsKey) {
          // Replace JS object image property (e.g. image: '/images/...')
          const searchImage = freshVal || originalValue;
          const escapedSearch = searchImage.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const escapedKey = jsKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const jsPropRegex = new RegExp(`(\\b${escapedKey}\\b|['"]${escapedKey}['"])\\s*:\\s*(['"])${escapedSearch}\\2`, 'g');
          if (jsPropRegex.test(fileContent)) {
            fileContent = fileContent.replace(jsPropRegex, `$1: $2${value}$2`);
            contentChanged = true;
          }
        } else {
          // General image string literal replacement (for t("/images/...") or any generic image string)
          const searchImage = freshVal || originalValue;
          if (searchImage && searchImage.length > 1) {
            const escapedSearch = searchImage.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const literalRegex = new RegExp(`(['"\`])${escapedSearch}\\1`, 'g');
            if (literalRegex.test(fileContent)) {
              fileContent = fileContent.replace(literalRegex, `$1${value}$1`);
              contentChanged = true;
            } else {
              const exactRegex = new RegExp(escapedSearch, 'g');
              if (exactRegex.test(fileContent)) {
                fileContent = fileContent.replace(exactRegex, value);
                contentChanged = true;
              }
            }
          }
        }
      } else {
        // Use current text on disk (freshVal) as the search value, fallback to originalValue
        let searchVal = freshVal || originalValue || '';
        const escaped = searchVal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const parts = escaped.split(/\s+/).filter(Boolean);
        const regexStr = parts.length > 0 ? parts.join('(?:<[^>]+>|\\s)*') : '';
        const textRegex = regexStr ? new RegExp(regexStr, 'gi') : null;

        if (textRegex) {
          let targetIndex = 0;
          const keyMatch = fieldKey.match(/_(\d+)$/);
          if (keyMatch) {
            targetIndex = parseInt(keyMatch[1], 10) - 1;
          }

          const isHeading = fieldKey.startsWith('heading');
          const isParagraph = fieldKey.startsWith('paragraph');

          // 1. Precise index-based replacement first (safest for duplicates)
          let currentIndex = 0;
          let preciseReplaced = false;
          let updatedContent = '';

          if (isHeading) {
            const headingTagRegex = /<(h[1-4])([^>]*)>([\s\S]*?)<\/h[1-4]>/gi;
            updatedContent = fileContent.replace(headingTagRegex, (match, tag, attrs, innerContent) => {
              if (currentIndex === targetIndex) {
                currentIndex++;
                const cleanedInner = cleanText(innerContent);
                const cleanedSearch = cleanText(searchVal);
                if (cleanedInner.toLowerCase() === cleanedSearch.toLowerCase() || innerContent.match(textRegex)) {
                  preciseReplaced = true;
                  return `<${tag}${attrs}>${value}</${tag}>`;
                }
              } else {
                currentIndex++;
              }
              return match;
            });
          } else if (isParagraph) {
            const paragraphTagRegex = /<p(?!\w)([^>]*)>([\s\S]*?)<\/p>/gi;
            updatedContent = fileContent.replace(paragraphTagRegex, (match, attrs, innerContent) => {
              if (currentIndex === targetIndex) {
                currentIndex++;
                const cleanedInner = cleanText(innerContent);
                const cleanedSearch = cleanText(searchVal);
                if (cleanedInner.toLowerCase() === cleanedSearch.toLowerCase() || innerContent.match(textRegex)) {
                  preciseReplaced = true;
                  return `<p${attrs}>${value}</p>`;
                }
              } else {
                currentIndex++;
              }
              return match;
            });
          }

          if (preciseReplaced) {
            fileContent = updatedContent;
            contentChanged = true;
          } else {
            // 2. Text-based fallback (replaces only the first matching tag to avoid scrambling other duplicates)
            const tagRegex = /(<(h[1-4]|p(?!\w))[^>]*>)([\s\S]*?)(<\/\2>)/gi;
            let replaced = false;
            const fallbackContent = fileContent.replace(tagRegex, (match, openTag, tagName, innerContent, closeTag) => {
              if (replaced) return match;
              
              const isTypeMatch = (isHeading && tagName.toLowerCase().startsWith('h')) ||
                                  (isParagraph && tagName.toLowerCase() === 'p');
              
              if (isTypeMatch) {
                const newInner = innerContent.replace(textRegex, value);
                if (newInner !== innerContent) {
                  replaced = true;
                  return `${openTag}${newInner}${closeTag}`;
                }
              }
              return match;
            });

            if (replaced) {
              fileContent = fallbackContent;
              contentChanged = true;
              console.log(`Fallback text replacement: Updated first match of "${searchVal}" to "${value}" for ${fieldKey}`);
            } else {
              // 3. Absolute index-based fallback
              let indexReplaced = false;
              if (isHeading) {
                const newContent = replaceHeadingContentByIndex(fileContent, targetIndex, value);
                if (newContent !== fileContent) {
                  fileContent = newContent;
                  contentChanged = true;
                  indexReplaced = true;
                  console.log(`Index-based fallback: Updated heading tag at index ${targetIndex} to "${value}"`);
                }
              } else if (isParagraph) {
                const newContent = replaceParagraphContentByIndex(fileContent, targetIndex, value);
                if (newContent !== fileContent) {
                  fileContent = newContent;
                  contentChanged = true;
                  indexReplaced = true;
                  console.log(`Index-based fallback: Updated paragraph tag at index ${targetIndex} to "${value}"`);
                }
              }

              if (!indexReplaced) {
                // 4. Direct literal or plain text search and replace (ideal for spans, divs, list items, and JS string arrays)
                if (searchVal.length > 1) {
                  const escapedSearch = searchVal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                  
                  // A. Match inside quotes: "searchVal" or 'searchVal' or `searchVal`
                  const literalRegex = new RegExp(`(['"\`])${escapedSearch}\\1`, 'g');
                  // B. Match inside JSX tag contents: >searchVal<
                  const jsxRegex = new RegExp(`>\\s*${escapedSearch}\\s*<`, 'g');

                  if (literalRegex.test(fileContent)) {
                    fileContent = fileContent.replace(literalRegex, `$1${value}$1`);
                    contentChanged = true;
                    indexReplaced = true;
                    console.log(`Direct string literal replacement: "${searchVal}" to "${value}"`);
                  } else if (jsxRegex.test(fileContent)) {
                    fileContent = fileContent.replace(jsxRegex, `>${value}<`);
                    contentChanged = true;
                    indexReplaced = true;
                    console.log(`Direct JSX text replacement: ">${searchVal}<" to ">${value}<"`);
                  } else {
                    // Fallback to exact raw replacement if found in file
                    const exactRegex = new RegExp(escapedSearch, 'g');
                    if (exactRegex.test(fileContent)) {
                      fileContent = fileContent.replace(exactRegex, value);
                      contentChanged = true;
                      indexReplaced = true;
                      console.log(`Direct raw replacement: "${searchVal}" to "${value}"`);
                    }
                  }
                }
              }

              if (!indexReplaced) {
                console.warn(`Could not find text or index in file: "${searchVal}" for ${fieldKey}`);
              }
            }
          }
        }
      }
    }

    if (contentChanged) {
      writeFileSync(absolutePath, fileContent, 'utf-8');
      console.log(`Successfully updated file: ${section.filePath}`);
    }
  }
}

function replaceHeadingContentByIndex(fileContent, targetIndex, newValue) {
  const tagRegex = /<(h[1-4])([^>]*)>([\s\S]*?)<\/h[1-4]>/gi;
  let currentIndex = 0;
  return fileContent.replace(tagRegex, (match, tag, attrs, innerContent) => {
    if (currentIndex === targetIndex) {
      currentIndex++;
      return `<${tag}${attrs}>${newValue}</${tag}>`;
    }
    currentIndex++;
    return match;
  });
}

function replaceParagraphContentByIndex(fileContent, targetIndex, newValue) {
  const tagRegex = /<p(?!\w)([^>]*)>([\s\S]*?)<\/p>/gi;
  let currentIndex = 0;
  return fileContent.replace(tagRegex, (match, attrs, innerContent) => {
    if (currentIndex === targetIndex) {
      currentIndex++;
      return `<p${attrs}>${newValue}</p>`;
    }
    currentIndex++;
    return match;
  });
}
