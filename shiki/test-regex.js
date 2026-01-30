// Better test
const html = '\u003cspan style=\"color:var(--token-MARKDOWN_LIST_MARKER);font-style:italic\"\u003e-\u003c/span\u003e';

console.log('Input HTML:', html);
console.log('\\nTesting different regex patterns:\\n');

// The exact pattern from the code (line 67)
const currentRegex = /\u003cspan style=\"color:\\s*var\\(--token-([^)]+)\\)([^\"]*)\"/g;
console.log('1. Current regex (with \\\\s* for optional space):');
const match1 = html.match(currentRegex);
console.log('   Match:', match1);

// Without optional space
const regex2 = /\u003cspan style=\"color:var\\(--token-([^)]+)\\)([^\"]*)\"/g;
console.log('\\n2. Without \\\\s* (no space):');
const match2 = html.match(regex2);
console.log('   Match:', match2);

// Test replacement with current regex
console.log('\\n3. Testing replacement with CURRENT regex:');
const replaced1 = html.replace(/\u003cspan style=\"color:\\s*var\\(--token-([^)]+)\\)([^\"]*)\"/g, (match, tokenKey, otherStyles) => {
    console.log('   Matched! tokenKey:', tokenKey, 'otherStyles:', otherStyles);
    return `\u003cspan data-token="${tokenKey}" style="color: var(--token-${tokenKey})${otherStyles}"`;
});
console.log('   Result:', replaced1);

// Test replacement without \\s*
console.log('\\n4. Testing replacement WITHOUT \\\\s*:');
const replaced2 = html.replace(/\u003cspan style=\"color:var\\(--token-([^)]+)\\)([^\"]*)\"/g, (match, tokenKey, otherStyles) => {
    console.log('   Matched! tokenKey:', tokenKey, 'otherStyles:', otherStyles);
    return `\u003cspan data-token="${tokenKey}" style="color: var(--token-${tokenKey})${otherStyles}"`;
});
console.log('   Result:', replaced2);

console.log('\\n5. Final check - are they different?');
console.log('   Changed:', html !== replaced2);
