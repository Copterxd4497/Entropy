/**
 * Minimal tokeniser that returns an array of {type, text} tokens.
 * Supports C++, Python, JavaScript, TypeScript, Java, Go, Rust.
 */

const KEYWORDS = new Set([
  // C++ / Java / Go / Rust shared
  "class","public","private","protected","return","if","else","for","while",
  "do","break","continue","new","delete","nullptr","true","false","this",
  "const","static","void","int","long","short","char","bool","float","double",
  "struct","enum","namespace","using","include","auto","template","typename",
  "operator","virtual","override","inline","extern","typedef","sizeof",
  // Python
  "def","import","from","as","in","not","and","or","is","None","True","False",
  "pass","lambda","yield","with","raise","try","except","finally","global",
  "nonlocal","assert","del","elif","print",
  // JS / TS
  "function","var","let","const","=>","async","await","typeof","instanceof",
  "export","default","extends","implements","interface","type","enum",
  "switch","case","throw","catch","finally","of",
  // Go
  "func","go","defer","chan","map","range","select","fallthrough","goto",
  "package","import","var","type","struct","interface","make","len","cap",
  // Rust
  "fn","let","mut","impl","trait","mod","use","pub","crate","super","self",
  "match","loop","in","where","dyn","move","ref","unsafe","async","await",
]);

const TYPES = new Set([
  "vector","string","map","set","unordered_map","unordered_set","pair",
  "list","queue","stack","deque","array","tuple","optional","variant",
  "List","Dict","Set","Tuple","Optional","Union","Any","int","str","float",
  "bool","bytes","bytearray","complex","frozenset","type","object","super",
  "String","Integer","Long","Double","Boolean","Character","ArrayList",
  "HashMap","LinkedList","TreeMap","TreeSet","Number","BigInt","Symbol",
  "Vec","Option","Result","Box","Rc","Arc","String","HashMap","BTreeMap",
  "i32","i64","u32","u64","usize","isize","f32","f64",
]);

export function tokenize(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    // Line comment
    if (code[i] === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const text = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: "tok-comment", text });
      i += text.length;
      continue;
    }
    // Block comment
    if (code[i] === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      const text = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      tokens.push({ type: "tok-comment", text });
      i += text.length;
      continue;
    }
    // Python # comment
    if (code[i] === "#") {
      const end = code.indexOf("\n", i);
      const text = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: "tok-comment", text });
      i += text.length;
      continue;
    }
    // String literals (single or double quoted, no multiline)
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== q && code[j] !== "\n") {
        if (code[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, code.length);
      tokens.push({ type: "tok-string", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // Numbers
    if (/[0-9]/.test(code[i]) || (code[i] === "-" && /[0-9]/.test(code[i + 1] || ""))) {
      let j = i + 1;
      while (j < code.length && /[0-9._xXaAbBcCdDeEfFlLuU]/.test(code[j])) j++;
      tokens.push({ type: "tok-number", text: code.slice(i, j) });
      i = j;
      continue;
    }
    // Identifiers & keywords
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      // Lookahead for function call
      const isCall = code[j] === "(";
      let type = "tok-plain";
      if (KEYWORDS.has(word)) type = "tok-keyword";
      else if (TYPES.has(word)) type = "tok-type";
      else if (isCall) type = "tok-fn";
      tokens.push({ type, text: word });
      i = j;
      continue;
    }
    // Punctuation / operators
    if (/[{}[\]();<>,.:!&|^~%=+\-*/\\?@]/.test(code[i])) {
      tokens.push({ type: "tok-punct", text: code[i] });
      i++;
      continue;
    }
    // Whitespace / newlines pass-through
    tokens.push({ type: "tok-plain", text: code[i] });
    i++;
  }

  return tokens;
}
