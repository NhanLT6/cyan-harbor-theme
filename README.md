# Cyan Harbor Theme - Color Palette & Features

## 🎨 Color Palette

### Syntax Colors
| Token | Color | Notes |
|-------|-------|-------|
| **Methods** | `#7B9CE7` | Pastel blue - instance & static methods |
| **Keywords** | `#BFA7FF` | Pastel purple - `public`, `async`, `var`, etc. |
| **Types/Parameters** | `#6FD9E8` | Pastel aqua - `int`, `string`, `IEnumerable<T>` |
| **Operators** | `#F8B4AB` | Soft rose - `=`, `==`, `!=`, `&&`, `||`, `!`, `()`, `{}` |
| **Strings** | `#90d89f` | Soft green |
| **Class Names** | `#ffd97d` | Soft yellow |
| **Comments** | `#546e7a` | Muted gray-blue |

### UI Accent Colors
| Element | Color | Usage |
|---------|-------|-------|
| **Primary Accent** | `#009688` | Teal - selected tabs, focus borders, scrollbar |
| **Secondary Accent** | `#80cbc4` | Light teal - hover states, tooltip borders |
| **Background** | `#263238` | Dark blue-gray base |
| **Foreground** | `#b8c5d0` | Light gray-blue text |
| **Selection** | `#314549` | Subtle blue-gray |
| **Caret** | `#e6cc00` | Bright yellow |

### Semantic Colors
| Type | Color | Usage |
|------|-------|-------|
| **Error** | `#ff7597` | Soft coral red |
| **Warning** | `#e6b858` | Muted amber |
| **Info** | `#7B9CE7` | Pastel blue (matches methods) |
| **VCS Added** | `#aed67d` | Soft lime green |
| **VCS Modified** | `#7B9CE7` | Pastel blue |
| **VCS Deleted** | `#ff7597` | Soft coral red |

---

## 🎯 Theme Features

### Color Harmony
- ✅ **Pastel philosophy** - All syntax colors are soft, light, easy on eyes
- ✅ **Cool base with warm accent** - Oceanic blues/cyans + soft rose operators
- ✅ **Connected color families** - Teal → Cyan → Blue gradient feels cohesive
- ✅ **No fighting colors** - Every color supports others, nothing overpowers
- ✅ **Consistent saturation/lightness** - Pastels maintain similar 65-75% lightness

### Syntax Highlighting
- ✅ **Method visibility** - Methods use distinct pastel blue (#7B9CE7)
- ✅ **Operator highlighting** - All operators in soft rose (#F8B4AB) for structure clarity
- ✅ **Type distinction** - Types/parameters in aqua (#6FD9E8) clearly separated from keywords
- ✅ **Semantic differentiation** - Keywords, strings, classes each have clear identity

### UI/UX Design
- ✅ **Islands Dark parent** - Uses Islands UI design system with rounded corners
- ✅ **Consistent borders** - Teal (#009688) for focus, light teal (#80cbc4) for hover
- ✅ **Tooltip styling** - Custom border color matching button hovers
- ✅ **Tab underlines** - 2px teal accent on active tabs
- ✅ **Scrollbar theming** - Teal scrollbar with transparency support

### Developer Experience
- ✅ **Long coding session friendly** - Pastel colors reduce eye strain
- ✅ **Clear code structure** - Operators and methods easily scannable
- ✅ **Professional appearance** - Balanced, not toy-like or overwhelming
- ✅ **VCS integration** - Clear visual feedback for git changes

---

## 📋 Theme Building Checklist

Use this as a guide when building new themes:

### 1. Define Color Palette
- [ ] Choose 3-4 core syntax colors (methods, keywords, types, operators)
- [ ] Select 2 accent colors (primary/secondary for UI)
- [ ] Define semantic colors (error, warning, info, success)
- [ ] Ensure color harmony (complementary or analogous scheme)
- [ ] Test readability on dark background

### 2. Syntax Token Mapping
- [ ] Methods: `DEFAULT_INSTANCE_METHOD`, `DEFAULT_STATIC_METHOD`
- [ ] Keywords: `DEFAULT_KEYWORD`
- [ ] Types/Parameters: `DEFAULT_PARAMETER`, `DEFAULT_NUMBER`
- [ ] Operators: `DEFAULT_OPERATION_SIGN`, `CSHARP_OPERATOR_SIGN`, `DEFAULT_PARENTHS`
- [ ] Strings: `DEFAULT_STRING`
- [ ] Classes: `DEFAULT_CLASS_NAME`
- [ ] Comments: `DEFAULT_LINE_COMMENT`, `DEFAULT_BLOCK_COMMENT`

### 3. UI Element Theming
- [ ] Tab underlines and selection states
- [ ] Button hover/focus states
- [ ] Tooltip borders and backgrounds
- [ ] Scrollbar colors (with transparency)
- [ ] Focus borders across all components
- [ ] Selection backgrounds (editor + lists)

### 4. VCS Integration
- [ ] File status colors (added, modified, deleted, changed)
- [ ] Git log colors (local branch, remote branch, tags)
- [ ] Debugger colors (breakpoints, changed values, errors)
- [ ] Error stripe markers

### 5. Fine-Tuning
- [ ] Test with real code examples
- [ ] Verify color contrast ratios
- [ ] Check harmony across all color families
- [ ] Ensure operators are visible but not overwhelming
- [ ] Test across different file types (C#, JSON, XML, etc.)

---

## 🔄 Next Theme Template

When building a new theme, copy this structure:

```
Theme Name: _______________
Philosophy: _______________

SYNTAX COLORS:
- Methods:     #______
- Keywords:    #______
- Types:       #______
- Operators:   #______
- Strings:     #______
- Classes:     #______

UI ACCENTS:
- Primary:     #______
- Secondary:   #______
- Background:  #______
- Foreground:  #______

SEMANTIC:
- Error:       #______
- Warning:     #______
- Info:        #______
```

Apply checklist above, test with Cyan Harbor as reference for balance/harmony.
