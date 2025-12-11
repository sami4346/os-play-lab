# Testing Guide - Process State Visualization

## Quick Start Testing

### 1. Build and Run
```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Build for production (optional)
npm run build
```

### 2. Access the Application
Open your browser to: `http://localhost:5173`

### 3. Basic Test Flow
1. Click **"Generate Random Processes"** button
2. Keep default algorithm (FCFS) selected
3. Click **"Start Simulation"** button
4. Watch the Process State Visualizer animate below the Gantt Chart

## Detailed Test Scenarios

### Test 1: Basic FCFS Animation
**Purpose**: Verify basic state transitions

**Steps**:
1. Generate random processes
2. Select "FCFS" algorithm
3. Run simulation
4. Observe animation

**Expected Results**:
- ✅ Processes start in "New" or "Ready" state
- ✅ One process at a time in "Running" state (sequential execution)
- ✅ Processes move to "Terminated" as they complete
- ✅ Animation lasts approximately 3 seconds
- ✅ All processes end in "Terminated" state

**Visual Check**:
```
New: [all processes] → Ready: [waiting] → Running: [P1] → Terminated: [P1]
                                         → Running: [P2] → Terminated: [P1,P2]
                                         → Running: [P3] → Terminated: [P1,P2,P3]
```

---

### Test 2: Round Robin Animation
**Purpose**: Verify context switching visualization

**Steps**:
1. Generate random processes
2. Select "Round Robin (RR)" algorithm
3. Set Time Quantum to 2
4. Run simulation

**Expected Results**:
- ✅ Multiple processes alternate between "Ready" and "Running"
- ✅ Context switches visible as processes move between states
- ✅ Animation shows dynamic Ready queue
- ✅ More complex state transitions than FCFS

**Visual Check**:
```
Ready: [P2,P3] → Running: [P1]
Ready: [P3,P1] → Running: [P2]  (P1 moved back to Ready)
Ready: [P1,P2] → Running: [P3]  (P2 moved back to Ready)
... continues until all complete
```

---

### Test 3: Staggered Arrivals (SRJF)
**Purpose**: Verify processes appearing at different times

**Steps**:
1. Click "Add Custom Process"
2. Add process P1: arrival=0, burst=10
3. Add process P2: arrival=5, burst=2
4. Add process P3: arrival=8, burst=1
5. Select "SRJF" algorithm
6. Run simulation

**Expected Results**:
- ✅ Initially only P1 visible (Running)
- ✅ P2 appears in "New" state at t=5, then moves to "Ready" or "Running"
- ✅ P3 appears at t=8
- ✅ Shorter jobs may preempt longer ones
- ✅ Animation shows processes appearing over time

**Visual Check**:
```
t=0-5:   Running: [P1]
t=5:     P2 appears → may preempt P1
t=8:     P3 appears → may preempt others
```

---

### Test 4: Priority Scheduling
**Purpose**: Verify priority-based state changes

**Steps**:
1. Generate random processes (note their priorities)
2. Select "Priority" algorithm
3. Run simulation
4. Observe animation

**Expected Results**:
- ✅ High-priority processes move to "Running" first
- ✅ Low-priority processes wait longer in "Ready" state
- ✅ Clear correlation between priority and execution order
- ✅ Animation shows priority queue behavior

---

### Test 5: Mobile Responsiveness
**Purpose**: Verify responsive design

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device emulation (Ctrl+Shift+M)
3. Select mobile device (e.g., iPhone 12)
4. Run a simulation

**Expected Results**:
- ✅ State boxes stack vertically
- ✅ Arrows point downward instead of horizontally
- ✅ All content remains readable
- ✅ Process badges wrap properly
- ✅ No horizontal scrolling

---

### Test 6: Edge Cases

#### Empty Processes
**Steps**: Run simulation without generating processes
**Expected**: Error toast: "Please generate processes first!"

#### Single Process
**Steps**: 
1. Add one custom process
2. Run simulation
**Expected**: Process moves from New → Ready → Running → Terminated

#### Many Processes (10+)
**Steps**:
1. Manually add 10 processes
2. Run simulation
**Expected**: All processes visible, no performance issues

---

## Visual Verification Checklist

### State Boxes
- [ ] All 5 state boxes are visible
- [ ] Each state has correct icon (⭐ ⏳ ⚡ ⏸️ ✓)
- [ ] Each state has correct color (Gray, Blue, Green, Yellow, Red)
- [ ] Each state shows correct description text
- [ ] Process count badges are accurate

### Process Badges
- [ ] Process badges match colors from process table
- [ ] Process PIDs are correct
- [ ] Badges animate smoothly when appearing
- [ ] Multiple badges in same state are visible
- [ ] Badges wrap properly when many processes

### Animation
- [ ] Animation starts automatically after simulation
- [ ] Animation lasts approximately 3 seconds
- [ ] Time display updates (shown in header)
- [ ] State transitions are smooth
- [ ] No flickering or jittering

### Layout
- [ ] Desktop: Horizontal flow (New → Ready ↔ Running)
- [ ] Mobile: Vertical flow with downward arrows
- [ ] Waiting and Terminated states at bottom
- [ ] Legend is visible and readable
- [ ] Proper spacing between elements

### Interactivity
- [ ] Hover over state box shows shadow effect
- [ ] All text is selectable
- [ ] No console errors
- [ ] No TypeScript warnings

---

## Performance Testing

### Metrics to Check
```javascript
// Open browser console and check:
// 1. Component render time
// 2. Animation frame rate (should be ~60fps)
// 3. Memory usage (check DevTools Performance tab)
```

### Expected Performance
- **Initial Render**: < 50ms
- **Animation Frame Rate**: 50-60 FPS
- **Memory Usage**: < 10MB additional
- **CPU Usage**: < 30% during animation

---

## Debugging Tips

### Issue: Animation Not Playing
**Check**:
1. Is `isSimulating` false?
2. Does `ganttChart` have data?
3. Are processes in "completed" status?

**Solution**: Check console for errors, verify simulation completed

---

### Issue: States Not Updating
**Check**:
1. Are arrival times set correctly?
2. Is animation time progressing?
3. Are processes appearing in console?

**Solution**: Add console.logs in useEffect hooks

---

### Issue: Visual Glitches
**Check**:
1. Are Tailwind classes loading?
2. Is dark mode interfering?
3. Browser compatibility?

**Solution**: Check CSS, try different browser

---

## Browser Compatibility

### Tested Browsers
- ✅ Chrome/Edge (Chromium) 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Known Issues
- None currently identified

---

## Automated Testing (Future)

### Unit Tests to Add
```typescript
// ProcessStateVisualizer.test.tsx
describe('ProcessStateVisualizer', () => {
  it('renders without crashing', () => {});
  it('shows correct state for each process', () => {});
  it('animates state transitions', () => {});
  it('handles empty process list', () => {});
  it('handles single process', () => {});
});
```

---

## User Acceptance Testing

### Student Feedback Questions
1. Is the visualization helpful for understanding process states?
2. Are the colors and icons intuitive?
3. Is the animation speed appropriate?
4. Do you understand the state transitions?
5. What improvements would you suggest?

### Educator Feedback Questions
1. Does it enhance teaching of OS concepts?
2. Are students more engaged?
3. Does it reduce confusion about states?
4. What additional features would help?

---

## Sign-Off Checklist

Before considering the feature complete:

- [ ] All test scenarios pass
- [ ] Visual verification complete
- [ ] Performance is acceptable
- [ ] No console errors or warnings
- [ ] Mobile responsive works
- [ ] Documentation is accurate
- [ ] Code is clean and commented
- [ ] TypeScript types are correct
- [ ] Integration with existing features works
- [ ] User feedback is positive

---

## Reporting Issues

If you find bugs or issues:

1. **Check console** for error messages
2. **Take screenshots** of the issue
3. **Note steps to reproduce**
4. **Record browser/OS version**
5. **Document expected vs actual behavior**

---

## Success Criteria

The feature is considered successful if:

✅ **Functionality**: All states display correctly  
✅ **Animation**: Smooth 3-second playback  
✅ **Accuracy**: State transitions match Gantt chart  
✅ **Education**: Students understand states better  
✅ **Performance**: No lag or stuttering  
✅ **Responsive**: Works on all screen sizes  
✅ **Integration**: Seamlessly fits into existing app  

---

**Happy Testing! 🎉**

If all tests pass, the Process State Visualization feature is ready for production use!
