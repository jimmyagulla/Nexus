---
name: api-http-adapters
description: Imperative rules for in HTTP adapters.
---

# API HTTP Adapters

## Allowed

- Implement controllers (`*.controller.ts`).
- Define DTOs for HTTP requests and responses in `dto/`.
- Use NestJS building blocks: `pipes/`, `guards/`, `filters/`, `interceptors/`.
- Use `class-validator` and `class-transformer` only in DTOs.
- Create Pipe factories in `pipes/`.

## DTOs

- One DTO class per file (`*.dto.ts`). File name matches the class (`GoalContributionResponseDto` → `goal-contribution-response.dto.ts`).
- Nested / child DTOs used by a parent get their own file. A parent DTO imports them; it must not declare them in the same file.

## Forbidden

- Export more than one DTO class from a `*.dto.ts` file.
- Create an `in/` subfolder.
- Register global components (`APP_PIPE`, `APP_GUARD`, etc.) here.
- Instantiate `ValidationPipe` or call `validate()` in controllers.
- Implement business logic or management rules.
- Import classes from `application/` (use in ports).
- Use `eslint-disable` comments.
- Manually manipulate the JSON response envelope (use `SuccessResponseInterceptor`).

## Dependencies

- Import: `@hexagonal-monorepo-template/ports`, `@hexagonal-monorepo-template/domain`, NestJS, `class-validator`, `class-transformer`.
- Never import: `@hexagonal-monorepo-template/application`.

## Swagger Documentation

- Systematically document controllers and methods via `@nestjs/swagger`.
- Use `@ApiProperty` in DTOs for each field.
- Ensure strict correspondence between documentation and implementation.

## Response Envelope

- Delegate success encapsulation to `SuccessResponseInterceptor`.
- Delegate error encapsulation to `ApiExceptionFilter`.
- Return only business data or `ApiResult` from controllers.
