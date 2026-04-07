# ocean-harbor.xml Token Guide

## Structure
Each token is an `<option name="TOKEN_KEY">` block:
```xml
<option name="ENUM_CONST">
  <value>
    <option name="FOREGROUND" value="5CBCB3" />
    <option name="FONT_TYPE" value="2" />  <!-- 0=normal 1=bold 2=italic 3=bold+italic -->
  </value>
</option>
```

## Important: shared colors
Many tokens share the same hex color. Before changing a color, grep the hex first — updating one occurrence may miss others. Use `replace_content` with the hex as the pattern.

## Key token groups

### General (cross-language)
- `DEFAULT_KEYWORD` — keywords, italic, `#C4B3F4`
- `DEFAULT_STRING` — strings, `#90D89F`
- `DEFAULT_NUMBER` — numbers, `#E3DE88`
- `DEFAULT_LINE_COMMENT`, `DEFAULT_BLOCK_COMMENT`, `DEFAULT_DOC_COMMENT` — italic, `#546E7A`
- `DEFAULT_CLASS_NAME` — `#6EC4BC`
- `DEFAULT_INTERFACE_NAME` — italic, `#5FB8AA`
- `DEFAULT_FUNCTION_DECLARATION`, `DEFAULT_FUNCTION_CALL` — `#89B4F7`
- `DEFAULT_LOCAL_VARIABLE` — `#B0D7B8`
- `DEFAULT_PARAMETER` — `#A7DBD8`
- `DEFAULT_INSTANCE_FIELD` — `#D9E6E6`
- `DEFAULT_STATIC_FIELD` — italic, `#D9E6E6`
- `DEFAULT_INSTANCE_METHOD`, `DEFAULT_STATIC_METHOD` — `#89B4F7` (static is italic)
- `DEFAULT_OPERATION_SIGN`, `DEFAULT_BRACES`, `DEFAULT_PARENTHS`, etc. — `#F8B4AB`

### C# / ReSharper
- `ENUM_CONST` — enum member values, `#5CBCB3`
- `ReSharper.ENUM_IDENTIFIER` — enum type names, `#5CBCB3`
- `ReSharper.ENUM_MEMBER_IDENTIFIER` — mirrors ENUM_CONST for Rider, `#5CBCB3`
- `ReSharper.NAMESPACE_IDENTIFIER` — `#80CBC4`
- `ReSharper.STRUCT_IDENTIFIER` — `#80CBC4`
- `ReSharper.DELEGATE_IDENTIFIER` — `#D0B8E0`
- `CSHARP_OPERATOR_SIGN` — `#F8B4AB`

### IDE Chrome (not in theme-data.json, directly in XML)
- `SELECTION_BACKGROUND` — `#314549`
- `CARET_ROW_COLOR` — `#1B2529`
- `IDENTIFIER_UNDER_CARET_ATTRIBUTES` — effect color `#3D8F87` (read, box border)
- `WRITE_IDENTIFIER_UNDER_CARET_ATTRIBUTES` — effect color `#3F7D77` (write, box border)
- `ADDED_LINES_COLOR` — `#75C486`
- `MODIFIED_LINES_COLOR` — `#CDB790`
- `DELETED_LINES_COLOR` — `#C88080`
- `INLAY_DEFAULT` — inlay hints with background pill, `#6E8E9E`
- `INLAY_TEXT_WITHOUT_BACKGROUND` — inlay hints no background, `#567585`

## Searching the XML
Use `search_for_pattern` with the hex value to find all usages before changing a shared color.
Use `replace_content` with regex to update specific token blocks.
