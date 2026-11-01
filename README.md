# Teltruva

**Tell. Translate. Trust.**

Teltruva is an AI-powered, multilingual consumer issue resolution application. It helps people turn receipts, billing records, and plain-language explanations into a structured case and a clear inquiry in the recipient organization's language.

For the PayPal AI Hackathon, Teltruva adds case-based PayPal Checkout. Each payment is associated with a Teltruva case ID, and the paid AI workflow is unlocked only for the matching case.

## Live Demo

https://teltruva-paypal.vercel.app

> The current public demo uses PayPal Sandbox. No real payment is charged.

## The Problem

A language barrier can turn a solvable service issue into financial loss.

Translation alone is not enough. A user may still need to determine:

- Which transaction details matter
- What evidence supports the inquiry
- Which information is missing
- How to explain the issue clearly
- What resolution to request
- Where to submit the inquiry through an official channel

Teltruva supports this workflow while keeping the user in control. It does not automatically send the inquiry or treat an unverified search result as an official contact route.

## What Teltruva Does

Teltruva allows a user to:

- Describe a consumer issue naturally in the user's preferred language
- Upload receipts, billing records, and other supporting documents
- Extract relevant transaction details from the evidence
- Separate source-confirmed facts from user-provided statements
- Identify essential missing information without inventing details
- Review the organized case before creating the inquiry
- Pay for the case-based AI support flow through PayPal Sandbox
- Generate a clear inquiry in the recipient's language
- Review the translated result before using it
- Copy the completed inquiry for an official web form, email, or chat
- View possible official contact routes while retaining responsibility for verification

Nothing is approved or sent without the user's review.

## PayPal + AI Workflow

1. The user explains the issue and uploads supporting evidence.
2. Teltruva creates a unique internal case ID and a user-facing case ID.
3. The case ID is passed into the PayPal order flow.
4. The user completes payment with a PayPal Sandbox Personal account.
5. Teltruva captures the PayPal order on the server side.
6. The completed payment is stored with the matching Teltruva case ID for the browser session.
7. AI processing continues only when the payment belongs to the current case.
8. A payment from a previous case cannot be reused for a different case.
9. Teltruva organizes the evidence, creates the inquiry, and presents the final result for user review and copying.

This is not a donation button added beside the product. PayPal Checkout is part of the service-delivery workflow and controls access to the paid case-processing step.

## Why PayPal Matters

Teltruva uses a case-based, one-time purchase model rather than a subscription. This fits a consumer workflow in which assistance may be needed only when a billing issue, unexpected charge, cancellation problem, or cross-border service dispute occurs.

The current Sandbox package is displayed as **USD 9.99** and includes the initial inquiry workflow and limited follow-up support. The amount and package design are prototype settings for the hackathon demonstration.

## AI Capabilities

Teltruva uses NVIDIA Nemotron through Nebius Token Factory for structured case analysis and inquiry generation. The AI workflow is designed to:

- Extract transaction and organization details from uploaded evidence
- Distinguish evidence from the user's own explanation
- Preserve uncertainty instead of inventing missing facts
- Organize the issue and requested outcome
- Generate a respectful, recipient-ready inquiry
- Support multilingual review and translation
- Suggest possible official contact routes for user verification

Model output is validated and remains subject to user review.

## Demo Flow

A representative demonstration uses a hotel receipt containing an unexpected fee.

1. Open the live demo.
2. Select the interface language.
3. Add a receipt or billing document.
4. Describe what happened in natural language.
5. Enter the requested resolution.
6. Select the recipient language.
7. Choose **Analyze case**.
8. Review the case-based purchase screen.
9. Complete payment using a PayPal Sandbox Personal buyer account.
10. Review the organized case.
11. Continue to the inquiry draft.
12. Review the translated result and official contact-route candidates.
13. Copy the inquiry for use in an official form, email, or chat.

Do not use the PayPal Sandbox Business merchant account as the buyer account.

## Hackathon Development

Teltruva's multilingual consumer-support concept and core AI workflow existed before the PayPal AI Hackathon. The following capabilities were added or expanded for this hackathon build:

- PayPal Sandbox Checkout integration
- Server-side PayPal order creation and capture
- Teltruva case ID generation
- Passing case identifiers through the payment flow
- Association of completed payment data with the correct case
- Case-based paid access to AI analysis
- Prevention of payment reuse across different cases
- Payment-aware retry behavior after a completed payment
- A one-time purchase screen explaining what is included

## Technology Stack

- React
- TypeScript
- Vite
- Vercel
- PayPal JavaScript SDK
- PayPal Orders API
- NVIDIA Nemotron
- Nebius Token Factory
- PDF.js
- Browser session storage for the current prototype

## High-Level Architecture

### Client

The React application manages intake, document selection, case review, the PayPal modal, inquiry generation, translation review, and copying the completed inquiry.

### Server-side API routes

Server-side routes protect credentials and handle:

- PayPal configuration
- PayPal order creation
- PayPal order capture
- AI and document-processing requests

### Case and payment association

Before payment, Teltruva creates and saves the current case. The PayPal order receives the Teltruva case identifiers. After capture, the application stores the completed capture together with the matching internal case ID. Paid access is recognized only when the stored case ID matches the active case.

## Local Setup

### Prerequisites

- Node.js 20 or later
- npm
- A PayPal Developer Sandbox application
- Access to the configured AI provider

### Installation

```bash
git clone <your-repository-url>
cd teltruva-paypal
npm install
```

### Environment Variables

Create a local environment file using the variable names expected by the server-side PayPal and AI routes in this repository.

At minimum, configure:

- PayPal Sandbox client ID
- PayPal Sandbox client secret
- PayPal environment set to Sandbox
- Nebius API key
- Any separately required NVIDIA credential used by the document-processing route

Never commit real credentials, Sandbox passwords, or environment files to GitHub.

### Run the Application

```bash
npm run dev
```

Open the local URL shown by Vite, typically:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

## Deployment

The public demonstration is deployed on Vercel:

https://teltruva-paypal.vercel.app

Required credentials are configured as Vercel environment variables and are not stored in the repository.

## Security and User Control

Teltruva is designed around the following principles:

- Do not invent essential transaction details
- Separate uploaded evidence from user-provided statements
- Require user review before the inquiry is used
- Do not send messages automatically
- Do not automatically treat a search result as an official contact channel
- Require the user to confirm the organization's official website or contact route
- Keep PayPal and AI credentials in server-side environment variables
- Associate payment status with the relevant case ID
- Avoid reusing a completed payment for another case

## Current Prototype Limitations

- PayPal runs in Sandbox mode; no real charge is made
- The current case and payment state use browser session storage
- Refreshing the page does not restore uploaded `File` objects
- Starting a new case clears the current browser-session case
- Previous cases are not yet available through a user account or case history page
- Closing the browser session may remove the active case state
- Document extraction quality depends on the source file
- Contact-route candidates require user verification
- Users should review all AI-generated content
- Teltruva does not automatically submit inquiries

## Planned Development

- Google and email sign-in with Firebase Authentication
- User-specific case history
- Secure cloud storage for case data, generated documents, and follow-up messages
- Reopening paid cases across browser sessions and devices
- Additional receipt and billing formats
- Additional languages, including Chinese and Hindi
- Improved official-contact-route discovery
- Expanded follow-up support
- Broader testing with cross-border customer-service scenarios

## Repository and Evaluation Notes

- The live application is intended to be evaluated with PayPal Sandbox.
- No real buyer or merchant credentials are included in the repository.
- The application should be tested with a Sandbox Personal account as the buyer.
- API keys and secrets must remain in local or Vercel environment variables.

## License

This project is licensed under the Apache License 2.0. See the `LICENSE` file for details.

Codegeist development repository.
