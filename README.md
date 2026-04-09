# Aurea Mobile UI

Product-grade React Native / Expo mobile frontend for a USDT-focused payments application.

## Overview

Aurea is a mobile product built around fast, clear, and trustworthy digital payments.  
The goal of the project is to create a premium user experience for balance overview, fund transfers, contact-based interactions, transaction history, and product-oriented navigation inside a fintech-style app.

This repository is **not** a static mockup or an isolated design exercise.  
It represents the **client-facing mobile layer of a broader product system**. The wider Aurea concept includes backend and business-logic integration for balances, transfers, contacts, history, and operational flows. This public repository focuses on the **mobile frontend, UI architecture, and product interaction layer**.

## Demo

### Home
![Aurea Home](demo/screenshots/home.png)

### Send flow
![Aurea Send](demo/screenshots/send.png)

### Contacts
![Aurea Contacts](demo/screenshots/contacts.png)


## What Aurea is

Aurea is a product-oriented mobile application concept and implementation for a modern digital payments experience centered around usability, trust, and visual consistency.

The project explores how a USDT-based payments product can feel:
- premium
- understandable
- operationally scalable
- consistent across screens and flows

In practical terms, Aurea is designed as a mobile client for a broader system where the frontend is responsible for:
- presenting balances and account state
- guiding transfer and send flows
- organizing user interactions around contacts and history
- providing a coherent product shell for future feature expansion

## Why Aurea exists

Many payment products solve infrastructure but fail at the user experience layer.  
Aurea was built to explore the opposite approach:

**How do you make a fintech product feel trustworthy, clean, and product-grade from the very first screen?**

This repository is the answer from a mobile product engineering perspective.

## What this repository demonstrates

This repository demonstrates more than UI implementation.

It shows:
- reusable mobile screen composition
- consistent layout and spacing rules
- product-grade interaction hierarchy
- scalable mobile frontend structure
- integration-ready client architecture for a larger payment platform
- engineering discipline in how UI is organized and maintained

## Product scope

The current product direction includes flows such as:
- balance overview
- send / transfer flows
- contact-based interaction
- history / activity navigation
- product discovery / navigation screens
- account-oriented mobile flows

## My role

I designed and implemented the mobile frontend structure, screen composition, reusable UI patterns, and product-facing interaction logic.

My focus was not only on making the interface look good, but on building a frontend that can evolve into a real product without collapsing into inconsistency.

## Engineering focus

Aurea should be viewed as a **product engineering case study**, not just a UI showcase.

Key priorities in this repository:
- reusable screen shell and composition rules
- safe-area aware layout behavior
- consistent spacing, geometry, and visual rhythm
- scalable component structure for future growth
- frontend architecture that is ready for backend integration
- visual clarity aligned with product trust

## Why this is more than UI

Although this repository is frontend-focused, Aurea is **not just a set of screens**.

It is the mobile layer of a wider product direction that assumes:
- backend services
- balance and transfer logic
- transaction history handling
- contact and account-related data
- real operational user flows

In other words, the value of this repository is not only in visuals, but in how the interface is structured to become part of a real product system.

## Tech stack

- React Native
- Expo
- JavaScript
- react-native-safe-area-context

## Run locally

```bash
npm install
npm run start
npm run ios
npm run android
npm run web