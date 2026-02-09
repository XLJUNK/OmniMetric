---
description: Rule for performing local commits after task completion
---

# Local Commit Rule

To ensure work is saved and traceable, follow these steps after completing a substantial set of tasks:

1. **Stage Changes**: Add all relevant changes to the git index.

   ```bash
   git add .
   ```

2. **Formulate Message**: Create a concise commit message in English (or as per project convention).

// turbo
3. **Request Confirmation**: Use `notify_user` to present the changes and the proposed commit message to the owner.

- Describe what was accomplished.
- Show the proposed commit message.
- Wait for approval.

1. **Execute Commit**: Once approved, perform the commit.

   ```bash
   git commit -m "Your approved message"
   ```

2. **Acknowledge**: Inform the user that the commit has been completed.
