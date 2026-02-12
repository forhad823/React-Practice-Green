/**
 * ================================================
 * note-1 :
 * 📘 useEffect + setInterval + Cleanup — Snake Game Documentation
 * ================================================
 *
 * This document explains:
 * 1️⃣ Why setInterval is used inside useEffect
 * 2️⃣ Why cleanup (clearInterval) is written
 * 3️⃣ Why cleanup appears BOTH:
 *      - at the TOP (before creating a new interval)
 *      - at the BOTTOM (inside the return function)
 * 4️⃣ Why refresh ≠ unmount
 *
 * ---------------------------------------------------------------------------
 * 🧠 CORE IDEA (BEGINNER FRIENDLY)
 * ---------------------------------------------------------------------------
 * JavaScript timers (setInterval / setTimeout) do NOT stop automatically.
 * React also does NOT manage them for you.
 *
 * If you create a new interval without stopping the old one:
 * 👉 multiple intervals run in parallel
 * 👉 game logic fires multiple times
 * 👉 bugs appear (speed doubles, ghost movement, memory leaks)
 *
 * So: EVERY interval must have a cleanup.
 *
 * -------------------------------------------
 * 🔁 BASIC STRUCTURE
 * -------------------------------------------
 *
 * useEffect(() => {
 *   const intervalId = setInterval(step, speed);
 *
 *   return () => clearInterval(intervalId);
 * }, [dependencies]);
 *
 * This cleanup runs when:
 * - component unmounts
 * - dependencies change
 * - React Strict Mode simulates re-mount
 *
 * --------------------------------------------------
 * ❓ WHY CLEANUP AT THE *BOTTOM* (return function)?
 * --------------------------------------------------
 *
 * This cleanup handles:
 * ✅ component unmount
 * ✅ dependency change (pause, resume, speed change)
 * ✅ Strict Mode double-invocation (development only)
 *
 * Meaning:
 * "Before this effect runs again or disappears, stop the old interval."
 *
 * ------------------------------------------------
 * ❓ WHY AN EXTRA CLEANUP AT THE *TOP*?
 * ------------------------------------------------
 *
 * Example pattern:
 *
 * useEffect(() => {
 *   if (intervalRef.current) {
 *     clearInterval(intervalRef.current); // 👈 TOP cleanup
 *   }
 *
 *   intervalRef.current = setInterval(step, speed);
 *
 *   return () => clearInterval(intervalRef.current); // 👈 BOTTOM cleanup
 * }, [speed, paused]);
 *
 * This is NOT redundant. Each cleanup protects a DIFFERENT scenario.
 *
 * ------------------------------------------------
 * 🧩 TOP CLEANUP — "DEFENSIVE CLEANUP"
 * ------------------------------------------------
 *
 * Purpose:
 * - Prevent accidental multiple intervals
 * - Handle logic mistakes
 * - Handle fast state changes (pause → resume → speed change)
 *
 * Think of it as:
 * 🛑 "Before creating a new interval, make SURE no old one exists."
 *
 * This protects against:
 * ❌ double setInterval
 * ❌ overlapping timers
 * ❌ hard-to-debug race conditions
 *
 * --------------------------------------------------
 * 🧩 BOTTOM CLEANUP — "REACT LIFECYCLE CLEANUP"
 * --------------------------------------------------
 *
 * Purpose:
 * - Follow React’s official effect lifecycle
 * - Cleanup when:
 *   • component unmounts
 *   • dependencies change
 *
 * Think of it as:
 * 🔚 "When React is done with this effect, clean up."
 *
 * This is REQUIRED and NOT optional.
 *
 * ---------------------------------------------------
 * ⏸️ WHY INTERVAL STILL FIRED WHEN GAME WAS PAUSED?
 * ---------------------------------------------------
 *
 * Pausing the game usually means:
 * - state changes (paused = true)
 * - component is STILL mounted
 *
 * If cleanup is missing:
 * 👉 interval continues running in background
 *
 * If cleanup exists:
 * 👉 interval is cleared
 * 👉 effect re-runs safely
 *
 * ------------------------------------------------
 * 🔄 WHY YOU DID NOT SEE THE BUG AFTER REFRESH?
 * ------------------------------------------------
 *
 * Browser refresh:
 * ❌ does NOT call React cleanup
 * ❌ does NOT unmount components
 *
 * Instead:
 * 💥 JavaScript engine is destroyed instantly
 * 💥 All intervals are killed by the browser
 *
 * That’s why refresh HIDES bugs.
 *
 * -------------------------------------------
 * ❗ IMPORTANT RULE (MEMORIZE THIS)
 * -------------------------------------------
 *
 * React cleanup protects:
 * ✅ long-running apps
 * ❌ NOT browser refresh
 *
 * Missing cleanup bugs appear ONLY when:
 * - React keeps running
 * - effects re-run
 * - components mount/unmount dynamically
 *
 * ---------------------------------------------
 * ✅ FINAL TAKEAWAY
 * ---------------------------------------------
 *
 * TOP cleanup  → defensive programming (safety net)
 * BOTTOM cleanup → React lifecycle responsibility
 *
 * Using BOTH is a best practice for real-time games.
 *
 * =================================================
 */

/**
 * ================================================
 * note-2 :
 * step: move one tick depending on directionRef.current
 * ================================================
 *
 * Moves the snake ONE step forward.
 * This function is called repeatedly by setInterval.
 *
 * Responsibilities:
 * 1. Read current snake position
 * 2. Calculate next head position based on direction
 * 3. Detect collisions (wall / self / obstacle)
 * 4. Handle food eating
 * 5. Perform normal movement
 */

/**
 * ================{note-3}=====================
 * WHY resetGame() USES setTimeout() INSTEAD OF   DIRECT startGame()
 * ==========================================
 *
 * CONTEXT
 * -------
 * In React, state updates (setState / useState setters) are:
 *   - Asynchronous
 *   - Batched
 *   - Applied AFTER the current function finishes execution
 *
 * This means calling a function immediately after setState
 * does NOT guarantee the state has already updated.
 *
 *
 * -------------------------------------
 * CURRENT IMPLEMENTATION
 * -------------------------------------
 *
 * const resetGame = () => {
 *   setRunning(false);
 *   setGameOver(false);
 *   setTimeout(() => startGame(), 50);
 * };
 *
 *
 * ------------------------------------------
 * EXECUTION ORDER (WITH setTimeout)
 * ------------------------------------------
 *
 * 1. setRunning(false)
 *    - React schedules the state update
 *
 * 2. setGameOver(false)
 *    - React schedules another state update
 *
 * 3. Function execution ends
 *    - React commits the pending state updates
 *    - Component re-renders
 *    - useEffect hooks react to the new state
 *    - Intervals / timers are cleaned up if needed
 *
 * 4. setTimeout callback fires (~50ms later)
 *    - startGame() runs AFTER the reset is fully applied
 *
 * RESULT:
 *   ✔ Game starts from a clean, predictable state
 *   ✔ No race conditions
 *   ✔ No stale state reads
 *
 *
 * ------------------------------------------
 * WHAT HAPPENS IF startGame() IS CALLED DIRECTLY
 * ------------------------------------------
 *
 * const resetGame = () => {
 *   setRunning(false);
 *   setGameOver(false);
 *   startGame(); // ❌ runs immediately
 * };
 *
 * EXECUTION ORDER:
 *
 * 1. setRunning(false)   → scheduled
 * 2. setGameOver(false)  → scheduled
 * 3. startGame() runs immediately
 * 4. React applies state updates AFTER function finishes
 *
 * PROBLEM:
 *   - startGame() may read OLD state values
 *   - Effects may not have cleaned up yet
 *   - Intervals may overlap
 *
 * WHY IT MAY "LOOK FINE":
 *   - State batching hides the issue
 *   - Game logic is simple
 *   - No timing-sensitive bug is triggered yet
 *
 * ⚠️ This is fragile and can break later.
 *
 *
 * ------------------------------------
 * REAL-WORLD ANALOGY
 * ------------------------------------
 *
 * Resetting a game is like:
 *   - Erasing a whiteboard (setState)
 *   - Writing new content (startGame)
 *
 * If you write BEFORE erasing finishes:
 *   - Old marks may remain
 *   - Content overlaps
 *
 * setTimeout ensures the board is clean before writing.
 *
 *
 * ----------------------------------------
 * WHY A SMALL DELAY (50ms) IS USED
 * ----------------------------------------
 *
 * - Allows React to:
 *   ✔ Commit state updates
 *   ✔ Re-render the component
 *   ✔ Run cleanup logic in useEffect
 *
 * The exact delay value is NOT important.
 * The purpose is sequencing, not waiting.
 *
 *
 * ------------------------------------------------------------
 * RECOMMENDED (REACT-IDIOMATIC) ALTERNATIVE
 * ------------------------------------------------------------
 *
 * Instead of using setTimeout, drive logic from state:
 *
 * useEffect(() => {
 *   if (!running && !gameOver) {
 *     startGame();
 *   }
 * }, [running, gameOver]);
 *
 * BENEFITS:
 *   ✔ startGame runs only AFTER state updates are committed
 *   ✔ No magic delays
 *   ✔ Predictable lifecycle behavior
 *
 *
 * ------------------------------------------------------------
 * FINAL TAKEAWAY
 * ------------------------------------------------------------
 *
 * - setState does NOT update immediately
 * - Immediate function calls may read stale state
 * - setTimeout avoids subtle race conditions
 * - State-driven effects are the cleanest solution
 *
 * This pattern prevents bugs that appear:
 *   - Under fast game loops
 *   - With intervals / timers
 *   - In React Strict Mode
 *   - After future refactors
 *
 * ============================================================
 */

