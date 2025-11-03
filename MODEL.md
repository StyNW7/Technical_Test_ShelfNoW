id          String   @id @default(cuid())
title       String
author      String
description String
isbn        String?  @unique
price       Float
stock       Int      @default(0)
imageUrl    String?
category    String
publisher   String?
publishedAt DateTime?
language    String   @default("English")
pages       Int?
isActive    Boolean  @default(true)
createdAt   DateTime @default(now())
updatedAt   DateTime @updatedAt