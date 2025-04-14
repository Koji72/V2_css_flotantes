# RPG Panels & Enhanced Tables Documentation

This documentation provides details on the implementation and usage of RPG-style panels with a two-column layout and the enhanced table component.

## Table of Contents

1. [RPG Panels](#rpg-panels)
   - [Overview](#overview)
   - [CSS Structure](#css-structure)
   - [HTML Structure](#html-structure)
   - [Responsive Behavior](#responsive-behavior)
2. [Enhanced Tables](#enhanced-tables)
   - [Component Props](#component-props)
   - [Table Styles](#table-styles)
   - [Features](#features)
   - [Usage Examples](#usage-examples)
3. [Integration Examples](#integration-examples)
   - [Character Sheets](#character-sheets)
   - [Inventory Management](#inventory-management)
   - [Quest Logs](#quest-logs)
4. [Best Practices](#best-practices)

## RPG Panels

### Overview

RPG-style panels provide a visually appealing container for tabletop gaming content. They feature:

- Two-column layout optimal for character sheets, item descriptions, and quest logs
- Decorative corners that provide a themed frame around content
- Consistent header styling with background colors
- Column headers for better content organization
- Responsive design that adapts to different screen sizes

### CSS Structure

The RPG panels styling is defined in `src/styles/rpg-columns.css` with these key components:

```css
/* Base panel structure */
.rpg-panel {
  position: relative;
  background-color: var(--rpg-panel-bg, #f8f3e9);
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Panel header */
.rpg-panel__header {
  background-color: var(--rpg-header-bg, #efe1c6);
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  font-size: 1.25rem;
  color: var(--rpg-header-color, #5a4123);
  border-bottom: 2px solid var(--rpg-border-color, #a89172);
}

/* Two-column layout */
.rpg-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
}
```

### HTML Structure

To create an RPG panel with two columns, use this structure:

```jsx
<section className="rpg-panel">
  {/* Decorative corners */}
  <div className="rpg-corner rpg-corner--tl"></div>
  <div className="rpg-corner rpg-corner--tr"></div>
  <div className="rpg-corner rpg-corner--bl"></div>
  <div className="rpg-corner rpg-corner--br"></div>
  
  {/* Panel header */}
  <div className="rpg-panel__header">
    Panel Title
  </div>
  
  {/* Two-column layout */}
  <div className="rpg-columns">
    <div className="rpg-column rpg-column--left">
      <div className="rpg-column__header">Left Column Title</div>
      {/* Left column content */}
    </div>
    
    <div className="rpg-column rpg-column--right">
      <div className="rpg-column__header">Right Column Title</div>
      {/* Right column content */}
    </div>
  </div>
</section>
```

### Responsive Behavior

The panels adapt to different screen sizes:

- On screens wider than 768px, content is displayed in two columns
- On screens smaller than 768px, columns stack vertically to ensure readability

## Enhanced Tables

### Component Props

The `EnhancedTable` component accepts these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | Required | Array of column definitions |
| `data` | `TableRow[]` | Required | Array of data rows |
| `style` | `TableStyle` | `'default'` | Visual style of the table |
| `zebra` | `boolean` | `false` | Enables zebra striping of rows |
| `hover` | `boolean` | `false` | Enables hover effect on rows |
| `bordered` | `boolean` | `false` | Adds borders to cells |
| `compact` | `boolean` | `false` | Reduces padding for dense layouts |
| `glowing` | `boolean` | `false` | Adds a subtle glow effect |
| `onRowClick` | `function` | — | Callback when a row is clicked |
| `ariaLabel` | `string` | — | Accessibility label |
| `className` | `string` | — | Additional CSS classes |

### Table Styles

Available styles include:

- `default`: Clean, minimal design
- `cyber`: Futuristic dark theme with neon accents
- `arcane`: Mystical purple theme
- `modern`: Professional clean design with subtle shadows
- `ancient`: Parchment-like appearance for historical themes
- `shadowy`: Dark theme with red accents
- `rpg`: Specifically designed for RPG content

### Features

- **Column Customization**: Define width, alignment, and custom rendering
- **Row Highlighting**: Mark important rows with the `highlighted` property
- **Zebra Striping**: Alternating row colors for better readability
- **Hover Effects**: Interactive feedback when users hover over rows
- **Responsive Design**: Tables adapt to different screen sizes

### Usage Examples

Basic usage:

```jsx
import { EnhancedTable } from '../components/EnhancedTable';

// Define columns
const columns = [
  { key: 'name', header: 'Name' },
  { key: 'type', header: 'Type' },
  { key: 'value', header: 'Value' }
];

// Define data
const data = [
  { id: 1, name: 'Sword', type: 'Weapon', value: 15 },
  { id: 2, name: 'Shield', type: 'Armor', value: 10, highlighted: true },
  { id: 3, name: 'Potion', type: 'Consumable', value: 5 }
];

// Render table
<EnhancedTable 
  columns={columns}
  data={data}
  style="rpg"
  zebra
  hover
  bordered
/>
```

With custom rendering:

```jsx
const columns = [
  { 
    key: 'name', 
    header: 'Name',
    render: (value, row) => <strong>{value}</strong>
  },
  { 
    key: 'value', 
    header: 'Value',
    align: 'right',
    render: (value) => `${value} gold`
  }
];
```

## Integration Examples

### Character Sheets

RPG panels are ideal for character sheets, dividing information into logical sections:

```jsx
<section className="rpg-panel">
  <div className="rpg-panel__header">
    Character Sheet: Thorgrim Stonehammer
  </div>
  
  <div className="rpg-columns">
    <div className="rpg-column rpg-column--left">
      <div className="rpg-column__header">Attributes</div>
      {/* Attributes table */}
    </div>
    
    <div className="rpg-column rpg-column--right">
      <div className="rpg-column__header">Skills & Abilities</div>
      {/* Skills content */}
    </div>
  </div>
</section>
```

### Inventory Management

Create organized inventory displays:

```jsx
<section className="rpg-panel">
  <div className="rpg-panel__header">
    Equipment & Inventory
  </div>
  
  <div className="rpg-columns">
    <div className="rpg-column rpg-column--left">
      <div className="rpg-column__header">Equipped Items</div>
      <EnhancedTable 
        columns={equipmentColumns}
        data={equipment}
        style="rpg"
        zebra
        hover
      />
    </div>
    
    <div className="rpg-column rpg-column--right">
      <div className="rpg-column__header">Carrying Capacity</div>
      {/* Weight and capacity information */}
    </div>
  </div>
</section>
```

### Quest Logs

Present quest information in an organized way:

```jsx
<section className="rpg-panel">
  <div className="rpg-panel__header">
    Active Quests
  </div>
  
  <div className="rpg-columns">
    <div className="rpg-column rpg-column--left">
      <div className="rpg-column__header">Main Quest</div>
      {/* Main quest details */}
    </div>
    
    <div className="rpg-column rpg-column--right">
      <div className="rpg-column__header">Side Quests</div>
      {/* List of side quests */}
    </div>
  </div>
</section>
```

## Best Practices

1. **Content Organization**: Use columns to group related information
2. **Consistent Styling**: Maintain visual consistency across multiple panels
3. **Mobile Optimization**: Test on small screens to ensure readability
4. **Font Choices**: Use serif fonts like 'EB Garamond' for an authentic RPG feel
5. **Table Integration**: When using tables within panels:
   - Use the `compact` prop on smaller screens
   - Choose table styles that complement the panel design
   - Consider using `hover` for interactive elements
6. **Accessibility**: Include proper headings and semantic HTML
7. **Performance**: Optimize images and keep table data reasonable in size 