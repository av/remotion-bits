### Task execution

You are a coding agent. Please keep going until the query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved. Autonomously resolve the query to the best of your ability, using the tools available to you, before coming back to the user. Do NOT guess or make up an answer.

You MUST adhere to the following criteria when solving queries:

- Working on the repo(s) in the current environment is allowed, even if they are proprietary.
- Analyzing code for vulnerabilities is allowed.
- Showing user code and tool call details is allowed.
- Use the apply_patch tool to edit files (NEVER try applypatch or apply-patch, only apply_patch): {"command":["apply_patch","*** Begin Patch\n*** Update File: path/to/file.py\n@@ def example():\n- pass\n+ return 123\n*** End Patch"]}

### Debugging methodology

When fixing bugs or errors, ALWAYS follow this process:

1. **Debug first, fix later** - Add logging/console statements to observe actual behavior before making changes
2. **Understand the full pipeline** - Trace data flow through the entire system (input → processing → output)
3. **Identify root cause** - Don't fix symptoms; understand why the error occurs at a fundamental level
4. **Verify assumptions** - Test that your understanding is correct by checking actual outputs, not assumed outputs
5. **Make comprehensive fixes** - Address all aspects of the problem in one proper solution, not incremental patches

**Observing runtime behavior when dev server is already running:**
- Check browser console via Simple Browser tool or ask user for console output
- Examine log files if they exist
- Use `ps aux | grep node` to check running processes (don't start new ones)
- NEVER try to run `npm run dev` or start services that are already running
- NEVER execute commands that would conflict with existing processes

NEVER:
- Make assumption-based fixes without observing actual behavior
- Apply surface-level regex/string fixes without understanding what data they process
- Guess at solutions and iterate blindly
- Fix one aspect while ignoring related issues in the same system
- Try to start servers or services that the user is already running

### Coding guidelines

If completing the user's task requires writing or modifying files, your code and final answer should follow these coding guidelines, though user instructions (i.e. AGENTS.md) may override these guidelines:

- Fix the problem at the root cause rather than applying surface-level patches, when possible.
- Avoid unneeded complexity in your solution.
- Do not attempt to fix unrelated bugs or broken tests. It is not your responsibility to fix them. (You may mention them to the user in your final message though.)
- Update documentation as necessary.
- Keep changes consistent with the style of the existing codebase. Changes should be minimal and focused on the task.
- Use git log and git blame to search the history of the codebase if additional context is required.
- NEVER add copyright or license headers unless specifically requested.
- Do not git commit your changes or create new git branches unless explicitly requested.
- Do not add any comments within code unless explicitly requested.
- Do not use one-letter variable names unless explicitly requested.

### Documenting your work

You're not allowed to create markdown files with outline of what you did. You'll be asked to produce such content when needed. This means that you should not create any new markdown files in the root of the project that describe your work. No such files are allowed.

### Development

**Critical constraints:**
- You can only run ONE foreground command at a time
- The dev server for docs is ALREADY RUNNING - never run `npm run dev`, `npm start`, or any server commands
- Running `npm run dev` will cause port conflicts and fail
- To observe runtime behavior, use Simple Browser tool or ask user for console output

**Workflow:**
- Use Playwright MCP or "Simple Browser" tool to validate your changes in the docs site
- When changing docs contents, you must update astro.config.mjs to reflect the changes in the sidebar or other relevant places
- For runtime errors, check browser console via Simple Browser or request output from user

### Adding new Bits

When adding new Bits to the documentation site, ensure that you:
1. Create the Bit in the appropriate directory under `docs/src/bits`
2. Update `astro.config.mjs` to include the new Bit in the sidebar navigation
3. Create a new mdx file for the Bit with proper frontmatter and content structure

When creating bits, keep the following in mind:
- Do not hardcode font sizes; use the `useViewportRect` and fractional sizing instead
- Use `rect.vmin`, `rect.vmax` for responsive sizing of the Bit elements

### Additional context

Refer to [COMPAL_LOG.md](./COMPAL_LOG.md) for additional technical context.