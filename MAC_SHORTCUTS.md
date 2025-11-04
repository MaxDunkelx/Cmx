# 🍎 Mac Shortcuts & Tips

## Delete Files on Mac

### In Finder (GUI)
1. Select file → Press `⌘ Delete` (Command + Delete)
2. Or right-click → Move to Trash
3. Empty trash: `⌘ Shift Delete`

### In Terminal
```bash
rm filename              # Delete one file
rm file1 file2 file3     # Delete multiple files
rm *.md                  # Delete all .md files
rm -r folder             # Delete folder and contents
rm -rf folder            # Force delete (careful!)
```

---

## Browser Dev Tools (Inspect Element) - Mac

### Chrome / Edge / Firefox
- **Open DevTools**: `⌥ ⌘ I` (Option + Command + I)
- **Open Console**: `⌥ ⌘ J` (Option + Command + J)
- **Toggle Inspector**: `⌥ ⌘ C` (Option + Command + C)
- **Right-click Inspect**: Right-click → Inspect
- **Menu**: View → Developer → Developer Tools

### Safari (Needs Enable First)
1. **Enable Developer Menu**: 
   - Safari → Settings → Advanced
   - ✅ Check "Show features for web developers"
2. **Then use**: `⌥ ⌘ I` (Option + Command + I)

### Firefox
- `⌥ ⌘ I` (Option + Command + I) - Inspector
- `⌥ ⌘ K` (Option + Command + K) - Console
- `⌥ ⌘ M` (Option + Command + M) - Network Monitor

---

## Common Mac Shortcuts

### System
- `⌘ C` - Copy
- `⌘ V` - Paste
- `⌘ X` - Cut
- `⌘ Z` - Undo
- `⌘ A` - Select All
- `⌘ Delete` - Delete (in Finder)
- `⌘ Shift Delete` - Empty Trash
- `⌘ Space` - Spotlight Search
- `⌘ Tab` - Switch Apps

### Finder
- `⌘ N` - New Finder Window
- `⌘ Shift N` - New Folder
- `⌘ Delete` - Move to Trash
- `⌘ Shift Delete` - Empty Trash
- `⌘ F` - Find

### Text Editing
- `⌘ B` - Bold
- `⌘ I` - Italic
- `⌘ U` - Underline
- `⌘ F` - Find
- `⌘ G` - Find Next

### Safari/Chrome
- `⌘ T` - New Tab
- `⌘ W` - Close Tab
- `⌘ Shift T` - Reopen Closed Tab
- `⌘ R` - Refresh
- `⌘ Shift R` - Hard Refresh (Clear Cache)
- `⌘ L` - Focus Address Bar
- `⌘ F` - Find on Page

---

## Terminal Commands

### Delete Files
```bash
rm filename              # Delete file
rm -i filename           # Delete with confirmation
rm file1 file2 file3     # Delete multiple files
rm *.md                  # Delete all .md files
rm -r folder             # Delete folder recursively
rm -rf folder            # Force delete (dangerous!)
```

### View Files
```bash
ls                       # List files
ls -la                   # List all with details
ls *.md                  # List only .md files
cat filename             # View file content
open .                   # Open current folder in Finder
```

### Navigate
```bash
cd folder                # Go to folder
cd ..                    # Go up one level
cd ~                     # Go to home
pwd                      # Show current directory
```

---

## Enable F Keys on Mac

If you want F12 to work like on Windows:

1. **System Settings** → **Keyboard** → **Keyboard Shortcuts**
2. Click **Function Keys** (left sidebar)
3. Check **"Use F1, F2, etc. as standard function keys"**

Or press `fn` + F12 in browsers

---

## Quick Tips

- **Screenshots**: `⌘ Shift 3` (full screen), `⌘ Shift 4` (select area)
- **Force Quit**: `⌘ Option Esc` → Select app → Force Quit
- **Hide Window**: `⌘ H`
- **Minimize**: `⌘ M`
- **Close Window**: `⌘ W`
- **Quit App**: `⌘ Q`

