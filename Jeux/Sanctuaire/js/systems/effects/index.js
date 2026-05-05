/*
   ROUTE : systems/effects/index.js
   RÔLE : Routeur des effets élémentaires
   EXPORTS : applyElementalEffects()
   DÉPENDANCES : fire.js, ice.js, lightning.js, poison.js, shadow.js
   NOTES :
     - Appelé après computeOffense()
     - Ajoute DOT / slow / chain / leech / couleur projectile
*/

import { applyFireEffect } from "./fire.js";
import { applyIceEffect } from "./ice.js";
import { applyLightningEffect } from "./lightning.js";
import { applyPoisonEffect } from "./poison.js";
import { applyShadowEffect } from "./shadow.js";

export function applyElementalEffects(source, dmgPacket) {

    switch (dmgPacket.type) {

        case "fire":
            return applyFireEffect(source, dmgPacket);

        case "ice":
            return applyIceEffect(source, dmgPacket);

        case "lightning":
            return applyLightningEffect(source, dmgPacket);

        case "poison":
            return applyPoisonEffect(source, dmgPacket);

        case "shadow":
            return applyShadowEffect(source, dmgPacket);
    }

    return dmgPacket;
}
