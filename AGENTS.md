## Overview

This document contains comprehensive development guidelines for the API project, covering JavaScript/TypeScript patterns, project structure conventions, controller implementation, logging, testing, and type definitions.

---

## Base Rules and Project Conventions

### JavaScript/TypeScript Patterns

1. Use arrow functions with explicit return types in snake_case format

   ```ts
   // Correct
   const get_item_by_id = (id: string): Promise<TItem> => { ... }

   // Incorrect
   function getItemById(id) { ... }
   ```

2. Use object destructuring for multiple parameters with default values at the end

   ```ts
   // Correct
   const create_item = ({ name, email, role = 'user' }: TCreateItemInput): Promise<TItem> => { ... }

   // Incorrect
   const createItem = (name, email, role) => { ... }
   ```

3. Prefer to keep file size small (200-300 lines) and focus on basic system design principles
4. Avoid using `any` type - use proper typing or `unknown` when necessary
5. Prefer `const` over `let`, avoid `var` completely
6. Use early returns to reduce nesting and improve readability
7. Always do named exports for variables, functions, types etc.
8. Use optional chaining and nullish coalescing operators

   ```ts
   const item_name = item?.name ?? 'No name'
   ```

### Project Structure

1. **Directory Organization**
   - `/src/classes`: For class-based implementations
   - `/src/configs`: For configuration files
   - `/src/constants`: For all application constants and enums
   - `/src/controllers`: For route handlers
   - `/src/helpers`: For domain-specific helper functions
   - `/src/middlewares`: For Express middlewares
   - `/src/models`: For database models
   - `/src/routes`: For API route definitions
   - `/src/scripts`: For maintenance scripts, migrations, and one-off tasks
   - `/src/services`: For external service integrations
   - `/src/tools`: For application-specific tools and utilities
   - `/src/types`: For TypeScript type definitions
   - `/src/utils`: For utility functions shared across the application
   - `/src/validators`: For input validation schemas

2. **Imports Order**
   - External dependencies first
   - Internal modules second, organized by path depth
   - Relative imports last

3. **File Naming**
   - Use kebab-case for file names: `item-service.ts`
   - Use snake_case for function and variable names: `get_item_by_id`
   - Use PascalCase for classes and types: `TItemModel`, `TItem`

### Error Handling

1. Use centralized error handling with the `throw_error` utility
2. Include appropriate HTTP status codes with errors
3. Avoid try/catch in controllers (handled by global error middleware)
4. Propagate errors with context rather than swallowing them

### Asynchronous Code

1. Use `async/await` instead of promise chains
2. Properly handle Promise rejections
3. Keep promise nesting minimal
4. Use Promise.all for parallel operations

   ```ts
   const promises = [fn_1(), fn_2()]
   const [result_1, result_2] = await Promise.all(promises)
   ```

### Code Organization

1. Group related functions and variables together
2. Keep files focused on a single responsibility
3. Extract complex logic into separate functions with descriptive names
4. Keep function bodies short and focused
5. Document complex algorithms and business rules with comments

### Performance Considerations

1. Optimize database queries and use appropriate indexes
2. Avoid N+1 query problems - use batch operations where possible
3. Use caching strategies for expensive operations
4. Implement pagination for large data sets
5. Limit deep nesting of promises, callbacks and functions arguments

### Security Practices

1. Validate all user inputs before processing
2. Use parameterized queries to prevent SQL injection
3. Implement proper authentication and authorization checks
4. Sanitize outputs to prevent XSS attacks and sensitive data leakage
5. Follow the principle of least privilege

### API Response Format

```ts
{
  message: string;
  data?: Record<string, any>;
  pagination?: TPagination;
}
```

---

## TypeScript Type Definition Conventions

### Rules

1. Prefix type names with 'T' (e.g., TDataType, TUserResponse)
2. Use type aliases over interfaces except for extendable object shapes
3. Use Record<K,T> for dynamic object types instead of { [key: string]: any }
4. Import types from '@/types' (app specific) directory or '@sales-os/shared' (models, common)
5. Use union types over type overloads when possible

### Examples

```ts
// Correct
export type TApiResponse = {
  message: string
  data?: Record<string, any>
  pagination?: TPagination
}

// Correct
export type TItemData = TItemData1 & TItemData2

// Incorrect - missing T prefix
export type BadType = {
  data: any
  [key: string]: any
}

// Incorrect - using interface
export interface IUserData {
  id: string
}
```

---

## Controller Development Guidelines

### Implementation

- Match file name and controller name, following REST principles
- Access authenticated user details from `req.user`
- Skip try/catch blocks in controllers (handled globally)
- Always validate requests using Zod at the beginning
- Use the mg object to access the database
- Create optimized query filters for database operations
- Use pagination for data fetches
- Optimize database calls through parallelization when possible

### Controller Error Handling

- Write user-friendly error messages
- Use `throw_error` utility with status codes: `throw_error('Not Found', 404)`
- Log errors with contextual metadata

### Example

```ts
import { z } from 'zod'

import { mg } from '@sales-os/db'

import { throw_error } from '@/utils/throw-error'

// Correct implementation
export const get_item_by_id = ({
  req,
  res
}: {
  req: TRequest
  res: TResponse
}): Promise<TResponse> => {
  // Validate input
  const { item_id } = z_get_item_by_id_req_params.parse(req.params)

  // Use service layer
  const item = await mg.items.findUnique({ where: { id: item_id } })

  if (!item) {
    throw_error('Item not found', 404)
  }

  // Standard response format
  return res.status(200).json({
    message: 'Item retrieved successfully',
    data: item
  })
}

const z_get_item_by_id_req_params = z.object({
  item_id: z.string().uuid('Invalid item ID format')
})

// Incorrect implementation
export const get_item = async (req, res) => {
  const item = await Items.findUnique({ where: { id: req.params.id } }) // Not using mg object and direct db access without zod validation
  return res.json({ success: true, item }) // Non-standard response
}
```
