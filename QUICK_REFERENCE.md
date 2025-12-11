# Process State Visualization - Quick Reference

## 📦 Component Overview

**File**: `src/components/ProcessStateVisualizer.tsx`  
**Type**: React Functional Component  
**Dependencies**: React, shadcn/ui (Card, Badge), Process types  

## 🎯 Props

```typescript
interface ProcessStateVisualizerProps {
  processes: Process[];           // Array of process objects
  ganttChart: GanttChartItem[];  // Timeline data for animation
  currentTime?: number;          // Optional: current sim time
  isSimulating?: boolean;        // Optional: simulation status
}
```

## 📊 Five States

| State | Status | Icon | Color | Hex |
|-------|--------|------|-------|-----|
| New | `'new'` | ⭐ | Gray | `#9ca3af` |
| Ready | `'ready'` | ⏳ | Blue | `#3b82f6` |
| Running | `'running'` | ⚡ | Green | `#10b981` |
| Waiting | `'waiting'` | ⏸️ | Yellow | `#eab308` |
| Terminated | `'terminated'` | ✓ | Red | `#ef4444` |

## 🔄 State Transitions

```
New → Ready:           arrivalTime <= currentTime
Ready → Running:       Process in current ganttChart item
Running → Ready:       Time quantum expires (RR)
Running → Terminated:  Process completes all burst time
```

## ⚡ Animation

- **Duration**: 3 seconds
- **Frame Rate**: 50ms per frame (20 FPS)
- **Trigger**: When `isSimulating` becomes `false`
- **Calculation**: `maxTime / (3000ms / 50ms)`

## 💻 Usage Example

```tsx
import ProcessStateVisualizer from '@/components/ProcessStateVisualizer';

// In your component:
<ProcessStateVisualizer 
  processes={processes}
  ganttChart={schedulingResult?.ganttChart || []}
  isSimulating={isSimulating}
/>
```

## 🎨 Styling

### Tailwind Classes Used
- `animate-in fade-in zoom-in duration-300` - Process badge animation
- `transition-all hover:shadow-md` - State box hover
- `grid grid-cols-5` - Desktop layout (md:)
- `space-y-4` - Mobile layout

### Responsive Breakpoints
- **Mobile** (`< 768px`): Vertical stack
- **Desktop** (`>= 768px`): Horizontal flow

## 📝 Key Functions

### `getStateConfig(status)`
Returns state configuration:
```typescript
{
  label: string,      // Display name
  color: string,      // Tailwind class
  description: string, // Help text
  icon: string        // Emoji icon
}
```

### State Calculation Logic
```typescript
// 1. Check arrival
if (arrivalTime <= animationTime) {
  status = 'ready';
}

// 2. Check running
if (inCurrentGanttItem) {
  status = 'running';
}

// 3. Check completion
if (allGanttItemsComplete) {
  status = 'terminated';
}
```

## 🐛 Common Issues

### Animation doesn't start
- Ensure `isSimulating` transitions to `false`
- Check `ganttChart` is populated
- Verify processes have `completionTime`

### States incorrect
- Verify `arrivalTime` values
- Check Gantt chart data integrity
- Ensure process status updates

### Visual glitches
- Confirm Tailwind CSS is loaded
- Check for CSS conflicts
- Verify browser compatibility

## 📚 Related Files

```
src/
├── components/
│   └── ProcessStateVisualizer.tsx  ← Main component
├── pages/
│   └── Index.tsx                   ← Integration point
├── types/
│   └── process.ts                  ← Type definitions
└── logic/
    └── cpuAlgorithms.ts           ← Generates ganttChart
```

## 🔧 Customization

### Change Animation Speed
```typescript
// In ProcessStateVisualizer.tsx
const animationDuration = 3000; // Change to 5000 for 5 seconds
```

### Add New State
```typescript
// 1. Update ExtendedProcessStatus type
type ExtendedProcessStatus = 'new' | ... | 'yourState';

// 2. Add to getStateConfig()
case 'yourState':
  return { label: '...', color: '...', ... };

// 3. Add calculation logic in useEffect
```

### Modify Colors
```typescript
// Update in getStateConfig()
color: 'bg-purple-500', // Use any Tailwind color
```

## 📖 Documentation Files

- `PROCESS_STATE_VISUALIZATION.md` - Comprehensive feature docs
- `PROCESS_STATE_IMPLEMENTATION.md` - Implementation summary
- `PROCESS_STATE_EXAMPLES.md` - Visual examples
- `TESTING_GUIDE.md` - Testing procedures

## ✅ Checklist for Integration

When adding to a new page:

1. [ ] Import component
2. [ ] Pass required props (`processes`, `ganttChart`)
3. [ ] Pass optional props if needed
4. [ ] Position in layout (after Gantt chart recommended)
5. [ ] Test animation triggers
6. [ ] Verify responsive layout
7. [ ] Check accessibility

## 🚀 Performance Tips

- Component re-renders only when props change
- Animation cleanup on unmount (prevents leaks)
- Efficient state calculation (O(n) complexity)
- No unnecessary DOM manipulations

## 🎓 Educational Tips

- Use with different algorithms to show behavior
- Pause and discuss state transitions
- Compare FCFS (sequential) vs RR (alternating)
- Highlight priority-based scheduling patterns

## 📞 Support

For issues or questions:
- Check documentation files
- Review test scenarios
- Inspect browser console
- Review component source code

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Maintainer**: OS Play Lab Team
