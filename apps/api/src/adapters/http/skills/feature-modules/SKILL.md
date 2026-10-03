---
name: api-http-feature-modules
description: >-
  One HTTP feature per capability. Use when adding or moving API controllers,
  DTOs, or response mappers.
---

# HTTP feature modules

Each capability has its own Nest module, its own controller, and its own folder under `adapters/http/<feature>/`.

## Split

- Company: general information, including the name and the non-working weekdays.
- Company settings: reading settings.
- Company holidays: public holidays.

Do not put these capabilities in one controller.

## Files

- Request and response DTOs live in `dto/` of the feature that owns them.
- A response mapper lives in the feature folder that owns that response.
- `toCompanySettingsResponse` and the settings response DTO live in the company-settings feature.
- A holiday line inside the settings response lives with company settings. A holiday write request lives with company holidays.
- Another feature that returns the settings representation imports that mapper and that DTO. It does not copy them.

## Review

Fail review if one controller owns settings, holidays, and company identity together, or if a settings DTO or `toCompanySettingsResponse` lives outside the company-settings feature.
