"use strict";

export default class Heroes {
    static ANA = 1;
    static BASTION = 2;
    static DVA = 3;
    static GENJI = 4;
    static HANZO = 5;
    static JUNKRAT = 6;
    static LUCIO = 7;
    static MCCREE = 8;
    static MEI = 9;
    static MERCY = 10;
    static ORISA = 11;
    static PHARAH = 12;
    static REAPER = 13;
    static REINHARDT = 14;
    static ROADHOG = 15;
    static SOLDIER76 = 16;
    static SOMBRA = 17;
    static SYMMETRA = 18;
    static TORBJORN = 19;
    static TRACER = 20;
    static WIDOWMAKER = 21;
    static WINSTON = 22;
    static ZARYA = 23;
    static ZENYATTA = 24;

    static ROLE = {
        DEFENSE: 1,
        OFFENSE: 2,
        SUPPORT: 3,
        TANK: 4,
    };

    static ITEMS = {
        [Heroes.ANA]: {
            id: Heroes.ANA,
            code: 'ANA',
            color: '#708AB3',
            icon: require('./assets/heroes/ANA.icon.png'),
            portrait: require('./assets/heroes/ANA.portrait.png'),
            background: require('./assets/heroes/ANA.background.png'),
            role: Heroes.ROLE.SUPPORT,
            difficulty: 3,
            abilities: [
                {
                    code: 'ANA_ABILITIES_BIOTIC_RIFLE',
                    icon: require('./assets/heroes/ANA.ability.BIOTIC_RIFLE.png'),
                },
                {
                    code: 'ANA_ABILITIES_SLEEP_DART',
                    icon: require('./assets/heroes/ANA.ability.SLEEP_DART.png'),
                },
                {
                    code: 'ANA_ABILITIES_BIOTIC_GRENADE',
                    icon: require('./assets/heroes/ANA.ability.BIOTIC_GRENADE.png'),
                },
                {
                    code: 'ANA_ABILITIES_NANO_BOOST',
                    icon: require('./assets/heroes/ANA.ability.NANO_BOOST.png'),
                },
            ],
        },
        [Heroes.BASTION]: {
            id: Heroes.BASTION,
            code: 'BASTION',
            color: '#7B8F7A',
            icon: require('./assets/heroes/BASTION.icon.png'),
            portrait: require('./assets/heroes/BASTION.portrait.png'),
            background: require('./assets/heroes/BASTION.background.png'),
            role: Heroes.ROLE.DEFENSE,
            difficulty: 1,
            abilities: [
                {
                    code: 'BASTION_ABILITIES_CONFIGURATION_RECON',
                    icon: require('./assets/heroes/BASTION.ability.CONFIGURATION_RECON.png'),
                },
                {
                    code: 'BASTION_ABILITIES_CONFIGURATION_SENTRY',
                    icon: require('./assets/heroes/BASTION.ability.CONFIGURATION_SENTRY.png'),
                },
                {
                    code: 'BASTION_ABILITIES_RECONFIGURE',
                    icon: require('./assets/heroes/BASTION.ability.RECONFIGURE.png'),
                },
                {
                    code: 'BASTION_ABILITIES_SELF-REPAIR',
                    icon: require('./assets/heroes/BASTION.ability.SELF-REPAIR.png'),
                },
                {
                    code: 'BASTION_ABILITIES_CONFIGURATION_TANK',
                    icon: require('./assets/heroes/BASTION.ability.CONFIGURATION_TANK.png'),
                },
            ],
        },
        [Heroes.DVA]: {
            id: Heroes.DVA,
            code: 'DVA',
            color: '#EE93C9',
            icon: require('./assets/heroes/DVA.icon.png'),
            portrait: require('./assets/heroes/DVA.portrait.png'),
            background: require('./assets/heroes/DVA.background.png'),
            role: Heroes.ROLE.TANK,
            difficulty: 2,
            abilities: [
                {
                    code: 'DVA_ABILITIES_FUSION_CANNONS',
                    icon: require('./assets/heroes/DVA.ability.FUSION_CANNONS.png'),
                },
                {
                    code: 'DVA_ABILITIES_LIGHT_GUN',
                    icon: require('./assets/heroes/DVA.ability.LIGHT_GUN.png'),
                },
                {
                    code: 'DVA_ABILITIES_BOOSTERS',
                    icon: require('./assets/heroes/DVA.ability.BOOSTERS.png'),
                },
                {
                    code: 'DVA_ABILITIES_DEFENSE_MATRIX',
                    icon: require('./assets/heroes/DVA.ability.DEFENSE_MATRIX.png'),
                },
                {
                    code: 'DVA_ABILITIES_SELF-DESTRUCT',
                    icon: require('./assets/heroes/DVA.ability.SELF-DESTRUCT.png'),
                },
                {
                    code: 'DVA_ABILITIES_CALL_MECH',
                    icon: require('./assets/heroes/DVA.ability.CALL_MECH.png'),
                },
            ],
        },
        [Heroes.GENJI]: {
            id: Heroes.GENJI,
            code: 'GENJI',
            color: '#97F043',
            icon: require('./assets/heroes/GENJI.icon.png'),
            portrait: require('./assets/heroes/GENJI.portrait.png'),
            background: require('./assets/heroes/GENJI.background.png'),
            role: Heroes.ROLE.OFFENSE,
            difficulty: 3,
            abilities: [
                {
                    code: 'GENJI_ABILITIES_SHURIKEN',
                    icon: require('./assets/heroes/GENJI.ability.SHURIKEN.png'),
                },
                {
                    code: 'GENJI_ABILITIES_DEFLECT',
                    icon: require('./assets/heroes/GENJI.ability.DEFLECT.png'),
                },
                {
                    code: 'GENJI_ABILITIES_SWIFT_STRIKE',
                    icon: require('./assets/heroes/GENJI.ability.SWIFT_STRIKE.png'),
                },
                {
                    code: 'GENJI_ABILITIES_DRAGONBLADE',
                    icon: require('./assets/heroes/GENJI.ability.DRAGONBLADE.png'),
                },
            ],
        },
        [Heroes.HANZO]: {
            id: Heroes.HANZO,
            code: 'HANZO',
            color: '#BAB58B',
            icon: require('./assets/heroes/HANZO.icon.png'),
            portrait: require('./assets/heroes/HANZO.portrait.png'),
            background: require('./assets/heroes/HANZO.background.png'),
            role: Heroes.ROLE.DEFENSE,
            difficulty: 3,
            abilities: [
                {
                    code: 'HANZO_ABILITIES_STORM_BOW',
                    icon: require('./assets/heroes/HANZO.ability.STORM_BOW.png'),
                },
                {
                    code: 'HANZO_ABILITIES_SONIC_ARROW',
                    icon: require('./assets/heroes/HANZO.ability.SONIC_ARROW.png'),
                },
                {
                    code: 'HANZO_ABILITIES_SCATTER_ARROW',
                    icon: require('./assets/heroes/HANZO.ability.SCATTER_ARROW.png'),
                },
                {
                    code: 'HANZO_ABILITIES_DRAGONSTRIKE',
                    icon: require('./assets/heroes/HANZO.ability.DRAGONSTRIKE.png'),
                },
            ],
        },
        [Heroes.JUNKRAT]: {
            id: Heroes.JUNKRAT,
            code: 'JUNKRAT',
            color: '#EABC52',
            icon: require('./assets/heroes/JUNKRAT.icon.png'),
            portrait: require('./assets/heroes/JUNKRAT.portrait.png'),
            background: require('./assets/heroes/JUNKRAT.background.png'),
            role: Heroes.ROLE.DEFENSE,
            difficulty: 2,
            abilities: [
                {
                    code: 'JUNKRAT_ABILITIES_FRAG_LAUNCHER',
                    icon: require('./assets/heroes/JUNKRAT.ability.FRAG_LAUNCHER.png'),
                },
                {
                    code: 'JUNKRAT_ABILITIES_CONCUSSION_MINE',
                    icon: require('./assets/heroes/JUNKRAT.ability.CONCUSSION_MINE.png'),
                },
                {
                    code: 'JUNKRAT_ABILITIES_STEEL_TRAP',
                    icon: require('./assets/heroes/JUNKRAT.ability.STEEL_TRAP.png'),
                },
                {
                    code: 'JUNKRAT_ABILITIES_TOTAL_MAYHEM',
                    icon: require('./assets/heroes/JUNKRAT.ability.TOTAL_MAYHEM.png'),
                },
                {
                    code: 'JUNKRAT_ABILITIES_RIP-TIRE',
                    icon: require('./assets/heroes/JUNKRAT.ability.RIP-TIRE.png'),
                },
            ],
        },
        [Heroes.LUCIO]: {
            id: Heroes.LUCIO,
            code: 'LUCIO',
            color: '#85C952',
            icon: require('./assets/heroes/LUCIO.icon.png'),
            portrait: require('./assets/heroes/LUCIO.portrait.png'),
            background: require('./assets/heroes/LUCIO.background.png'),
            role: Heroes.ROLE.SUPPORT,
            difficulty: 2,
            abilities: [
                {
                    code: 'LUCIO_ABILITIES_SONIC_AMPLIFIER',
                    icon: require('./assets/heroes/LUCIO.ability.SONIC_AMPLIFIER.png'),
                },
                {
                    code: 'LUCIO_ABILITIES_CROSSFADE',
                    icon: require('./assets/heroes/LUCIO.ability.CROSSFADE.png'),
                },
                {
                    code: 'LUCIO_ABILITIES_AMP_IT_UP',
                    icon: require('./assets/heroes/LUCIO.ability.AMP_IT_UP.png'),
                },
                {
                    code: 'LUCIO_ABILITIES_SOUND_BARRIER',
                    icon: require('./assets/heroes/LUCIO.ability.SOUND_BARRIER.png'),
                },
            ],
        },
        [Heroes.MCCREE]: {
            id: Heroes.MCCREE,
            code: 'MCCREE',
            color: '#B25A5F',
            icon: require('./assets/heroes/MCCREE.icon.png'),
            portrait: require('./assets/heroes/MCCREE.portrait.png'),
            background: require('./assets/heroes/MCCREE.background.png'),
            role: Heroes.ROLE.OFFENSE,
            difficulty: 2,
            abilities: [
                {
                    code: 'MCCREE_ABILITIES_PEACEKEEPER',
                    icon: require('./assets/heroes/MCCREE.ability.PEACEKEEPER.png'),
                },
                {
                    code: 'MCCREE_ABILITIES_COMBAT_ROLL',
                    icon: require('./assets/heroes/MCCREE.ability.COMBAT_ROLL.png'),
                },
                {
                    code: 'MCCREE_ABILITIES_FLASHBANG',
                    icon: require('./assets/heroes/MCCREE.ability.FLASHBANG.png'),
                },
                {
                    code: 'MCCREE_ABILITIES_DEADEYE',
                    icon: require('./assets/heroes/MCCREE.ability.DEADEYE.png'),
                },
            ],
        },
        [Heroes.MEI]: {
            id: Heroes.MEI,
            code: 'MEI',
            color: '#6DABEB',
            icon: require('./assets/heroes/MEI.icon.png'),
            portrait: require('./assets/heroes/MEI.portrait.png'),
            background: require('./assets/heroes/MEI.background.png'),
            role: Heroes.ROLE.DEFENSE,
            difficulty: 3,
            abilities: [
                {
                    code: 'MEI_ABILITIES_ENDOTHERMIC_BLASTER',
                    icon: require('./assets/heroes/MEI.ability.ENDOTHERMIC_BLASTER.png'),
                },
                {
                    code: 'MEI_ABILITIES_CRYO-FREEZE',
                    icon: require('./assets/heroes/MEI.ability.CRYO-FREEZE.png'),
                },
                {
                    code: 'MEI_ABILITIES_ICE_WALL',
                    icon: require('./assets/heroes/MEI.ability.ICE_WALL.png'),
                },
                {
                    code: 'MEI_ABILITIES_BLIZZARD',
                    icon: require('./assets/heroes/MEI.ability.BLIZZARD.png'),
                },
            ],
        },
        [Heroes.MERCY]: {
            id: Heroes.MERCY,
            code: 'MERCY',
            color: '#EBE9BC',
            icon: require('./assets/heroes/MERCY.icon.png'),
            portrait: require('./assets/heroes/MERCY.portrait.png'),
            background: require('./assets/heroes/MERCY.background.png'),
            role: Heroes.ROLE.SUPPORT,
            difficulty: 1,
            abilities: [
                {
                    code: 'MERCY_ABILITIES_CADUCEUS_STAFF',
                    icon: require('./assets/heroes/MERCY.ability.CADUCEUS_STAFF.png'),
                },
                {
                    code: 'MERCY_ABILITIES_CADUCEUS_BLASTER',
                    icon: require('./assets/heroes/MERCY.ability.CADUCEUS_BLASTER.png'),
                },
                {
                    code: 'MERCY_ABILITIES_GUARDIAN_ANGEL',
                    icon: require('./assets/heroes/MERCY.ability.GUARDIAN_ANGEL.png'),
                },
                {
                    code: 'MERCY_ABILITIES_ANGELIC_DESCENT',
                    icon: require('./assets/heroes/MERCY.ability.ANGELIC_DESCENT.png'),
                },
                {
                    code: 'MERCY_ABILITIES_RESURRECT',
                    icon: require('./assets/heroes/MERCY.ability.RESURRECT.png'),
                },
            ],
        },
        [Heroes.ORISA]: {
            id: Heroes.ORISA,
            code: 'ORISA',
            color: '#438A41',
            icon: require('./assets/heroes/ORISA.icon.png'),
            portrait: require('./assets/heroes/ORISA.portrait.png'),
            background: require('./assets/heroes/ORISA.background.png'),
            role: Heroes.ROLE.TANK,
            difficulty: 2,
            abilities: [
                {
                    code: 'ORISA_ABILITIES_FUSION_DRIVER',
                    icon: require('./assets/heroes/ORISA.ability.FUSION_DRIVER.png'),
                },
                {
                    code: 'ORISA_ABILITIES_FORTIFY',
                    icon: require('./assets/heroes/ORISA.ability.FORTIFY.png'),
                },
                {
                    code: 'ORISA_ABILITIES_HALT',
                    icon: require('./assets/heroes/ORISA.ability.HALT.png'),
                },
                {
                    code: 'ORISA_ABILITIES_PROTECTIVE_BARRIER',
                    icon: require('./assets/heroes/ORISA.ability.PROTECTIVE_BARRIER.png'),
                },
                {
                    code: 'ORISA_ABILITIES_SUPERCHARGER',
                    icon: require('./assets/heroes/ORISA.ability.SUPERCHARGER.png'),
                },
            ],
        },
        [Heroes.PHARAH]: {
            id: Heroes.PHARAH,
            code: 'PHARAH',
            color: '#3D7CC7',
            icon: require('./assets/heroes/PHARAH.icon.png'),
            portrait: require('./assets/heroes/PHARAH.portrait.png'),
            background: require('./assets/heroes/PHARAH.background.png'),
            role: Heroes.ROLE.OFFENSE,
            difficulty: 1,
            abilities: [
                {
                    code: 'PHARAH_ABILITIES_ROCKET_LAUNCHER',
                    icon: require('./assets/heroes/PHARAH.ability.ROCKET_LAUNCHER.png'),
                },
                {
                    code: 'PHARAH_ABILITIES_JUMP_JET',
                    icon: require('./assets/heroes/PHARAH.ability.JUMP_JET.png'),
                },
                {
                    code: 'PHARAH_ABILITIES_CONCUSSIVE_BLAST',
                    icon: require('./assets/heroes/PHARAH.ability.CONCUSSIVE_BLAST.png'),
                },
                {
                    code: 'PHARAH_ABILITIES_BARRAGE',
                    icon: require('./assets/heroes/PHARAH.ability.BARRAGE.png'),
                },
            ],
        },
        [Heroes.REAPER]: {
            id: Heroes.REAPER,
            code: 'REAPER',
            color: '#7F4053',
            icon: require('./assets/heroes/REAPER.icon.png'),
            portrait: require('./assets/heroes/REAPER.portrait.png'),
            background: require('./assets/heroes/REAPER.background.png'),
            role: Heroes.ROLE.OFFENSE,
            difficulty: 1,
            abilities: [
                {
                    code: 'REAPER_ABILITIES_HELLFIRE_SHOTGUNS',
                    icon: require('./assets/heroes/REAPER.ability.HELLFIRE_SHOTGUNS.png'),
                },
                {
                    code: 'REAPER_ABILITIES_WRAITH_FORM',
                    icon: require('./assets/heroes/REAPER.ability.WRAITH_FORM.png'),
                },
                {
                    code: 'REAPER_ABILITIES_SHADOW_STEP',
                    icon: require('./assets/heroes/REAPER.ability.SHADOW_STEP.png'),
                },
                {
                    code: 'REAPER_ABILITIES_DEATH_BLOSSOM',
                    icon: require('./assets/heroes/REAPER.ability.DEATH_BLOSSOM.png'),
                },
            ],
        },
        [Heroes.REINHARDT]: {
            id: Heroes.REINHARDT,
            code: 'REINHARDT',
            color: '#94A1A6',
            icon: require('./assets/heroes/REINHARDT.icon.png'),
            portrait: require('./assets/heroes/REINHARDT.portrait.png'),
            background: require('./assets/heroes/REINHARDT.background.png'),
            role: Heroes.ROLE.TANK,
            difficulty: 1,
            abilities: [
                {
                    code: 'REINHARDT_ABILITIES_ROCKET_HAMMER',
                    icon: require('./assets/heroes/REINHARDT.ability.ROCKET_HAMMER.png'),
                },
                {
                    code: 'REINHARDT_ABILITIES_BARRIER_FIELD',
                    icon: require('./assets/heroes/REINHARDT.ability.BARRIER_FIELD.png'),
                },
                {
                    code: 'REINHARDT_ABILITIES_CHARGE',
                    icon: require('./assets/heroes/REINHARDT.ability.CHARGE.png'),
                },
                {
                    code: 'REINHARDT_ABILITIES_FIRE_STRIKE',
                    icon: require('./assets/heroes/REINHARDT.ability.FIRE_STRIKE.png'),
                },
                {
                    code: 'REINHARDT_ABILITIES_EARTHSHATTER',
                    icon: require('./assets/heroes/REINHARDT.ability.EARTHSHATTER.png'),
                },
            ],
        },
        [Heroes.ROADHOG]: {
            id: Heroes.ROADHOG,
            code: 'ROADHOG',
            color: '#B78E53',
            icon: require('./assets/heroes/ROADHOG.icon.png'),
            portrait: require('./assets/heroes/ROADHOG.portrait.png'),
            background: require('./assets/heroes/ROADHOG.background.png'),
            role: Heroes.ROLE.TANK,
            difficulty: 1,
            abilities: [
                {
                    code: 'ROADHOG_ABILITIES_SCRAP_GUN',
                    icon: require('./assets/heroes/ROADHOG.ability.SCRAP_GUN.png'),
                },
                {
                    code: 'ROADHOG_ABILITIES_TAKE_A_BREATHER',
                    icon: require('./assets/heroes/ROADHOG.ability.TAKE_A_BREATHER.png'),
                },
                {
                    code: 'ROADHOG_ABILITIES_CHAIN_HOOK',
                    icon: require('./assets/heroes/ROADHOG.ability.CHAIN_HOOK.png'),
                },
                {
                    code: 'ROADHOG_ABILITIES_WHOLE_HOG',
                    icon: require('./assets/heroes/ROADHOG.ability.WHOLE_HOG.png'),
                },
            ],
        },
        [Heroes.SOLDIER76]: {
            id: Heroes.SOLDIER76,
            code: 'SOLDIER76',
            color: '#6B7996',
            icon: require('./assets/heroes/SOLDIER76.icon.png'),
            portrait: require('./assets/heroes/SOLDIER76.portrait.png'),
            background: require('./assets/heroes/SOLDIER76.background.png'),
            role: Heroes.ROLE.OFFENSE,
            difficulty: 1,
            abilities: [
                {
                    code: 'SOLDIER76_ABILITIES_HEAVY_PULSE_RIFLE',
                    icon: require('./assets/heroes/SOLDIER76.ability.HEAVY_PULSE_RIFLE.png'),
                },
                {
                    code: 'SOLDIER76_ABILITIES_HELIX_ROCKETS',
                    icon: require('./assets/heroes/SOLDIER76.ability.HELIX_ROCKETS.png'),
                },
                {
                    code: 'SOLDIER76_ABILITIES_SPRINT',
                    icon: require('./assets/heroes/SOLDIER76.ability.SPRINT.png'),
                },
                {
                    code: 'SOLDIER76_ABILITIES_BIOTIC_FIELD',
                    icon: require('./assets/heroes/SOLDIER76.ability.BIOTIC_FIELD.png'),
                },
                {
                    code: 'SOLDIER76_ABILITIES_TACTICAL_VISOR',
                    icon: require('./assets/heroes/SOLDIER76.ability.TACTICAL_VISOR.png'),
                },
            ],
        },
        [Heroes.SOMBRA]: {
            id: Heroes.SOMBRA,
            code: 'SOMBRA',
            color: '#755BBC',
            icon: require('./assets/heroes/SOMBRA.icon.png'),
            portrait: require('./assets/heroes/SOMBRA.portrait.png'),
            background: require('./assets/heroes/SOMBRA.background.png'),
            role: Heroes.ROLE.OFFENSE,
            difficulty: 3,
            abilities: [
                {
                    code: 'SOMBRA_ABILITIES_MACHINE_PISTOL',
                    icon: require('./assets/heroes/SOMBRA.ability.MACHINE_PISTOL.png'),
                },
                {
                    code: 'SOMBRA_ABILITIES_HACK',
                    icon: require('./assets/heroes/SOMBRA.ability.HACK.png'),
                },
                {
                    code: 'SOMBRA_ABILITIES_STEALTH',
                    icon: require('./assets/heroes/SOMBRA.ability.STEALTH.png'),
                },
                {
                    code: 'SOMBRA_ABILITIES_TRANSLOCATOR',
                    icon: require('./assets/heroes/SOMBRA.ability.TRANSLOCATOR.png'),
                },
                {
                    code: 'SOMBRA_ABILITIES_EMP',
                    icon: require('./assets/heroes/SOMBRA.ability.EMP.png'),
                },
            ],
        },
        [Heroes.SYMMETRA]: {
            id: Heroes.SYMMETRA,
            code: 'SYMMETRA',
            color: '#90BDCF',
            icon: require('./assets/heroes/SYMMETRA.icon.png'),
            portrait: require('./assets/heroes/SYMMETRA.portrait.png'),
            background: require('./assets/heroes/SYMMETRA.background.png'),
            role: Heroes.ROLE.SUPPORT,
            difficulty: 2,
            abilities: [
                {
                    code: 'SYMMETRA_ABILITIES_PHOTON_PROJECTOR',
                    icon: require('./assets/heroes/SYMMETRA.ability.PHOTON_PROJECTOR.png'),
                },
                {
                    code: 'SYMMETRA_ABILITIES_SENTRY_TURRET',
                    icon: require('./assets/heroes/SYMMETRA.ability.SENTRY_TURRET.png'),
                },
                {
                    code: 'SYMMETRA_ABILITIES_PHOTON_BARRIER',
                    icon: require('./assets/heroes/SYMMETRA.ability.PHOTON_BARRIER.png'),
                },
                {
                    code: 'SYMMETRA_ABILITIES_TELEPORTER',
                    icon: require('./assets/heroes/SYMMETRA.ability.TELEPORTER.png'),
                },
                {
                    code: 'SYMMETRA_ABILITIES_SHIELD_GENERATOR',
                    icon: require('./assets/heroes/SYMMETRA.ability.SHIELD_GENERATOR.png'),
                },
            ],
        },
        [Heroes.TORBJORN]: {
            id: Heroes.TORBJORN,
            code: 'TORBJORN',
            color: '#BF746E',
            icon: require('./assets/heroes/TORBJORN.icon.png'),
            portrait: require('./assets/heroes/TORBJORN.portrait.png'),
            background: require('./assets/heroes/TORBJORN.background.png'),
            role: Heroes.ROLE.DEFENSE,
            difficulty: 2,
            abilities: [
                {
                    code: 'TORBJORN_ABILITIES_RIVET_GUN',
                    icon: require('./assets/heroes/TORBJORN.ability.RIVET_GUN.png'),
                },
                {
                    code: 'TORBJORN_ABILITIES_FORGE_HAMMER',
                    icon: require('./assets/heroes/TORBJORN.ability.FORGE_HAMMER.png'),
                },
                {
                    code: 'TORBJORN_ABILITIES_BUILD_TURRET',
                    icon: require('./assets/heroes/TORBJORN.ability.BUILD_TURRET.png'),
                },
                {
                    code: 'TORBJORN_ABILITIES_ARMOR_PACK',
                    icon: require('./assets/heroes/TORBJORN.ability.ARMOR_PACK.png'),
                },
                {
                    code: 'TORBJORN_ABILITIES_MOLTEN_CORE',
                    icon: require('./assets/heroes/TORBJORN.ability.MOLTEN_CORE.png'),
                },
            ],
        },
        [Heroes.TRACER]: {
            id: Heroes.TRACER,
            code: 'TRACER',
            color: '#DA9644',
            icon: require('./assets/heroes/TRACER.icon.png'),
            portrait: require('./assets/heroes/TRACER.portrait.png'),
            background: require('./assets/heroes/TRACER.background.png'),
            role: Heroes.ROLE.OFFENSE,
            difficulty: 2,
            abilities: [
                {
                    code: 'TRACER_ABILITIES_PULSE_PISTOLS',
                    icon: require('./assets/heroes/TRACER.ability.PULSE_PISTOLS.png'),
                },
                {
                    code: 'TRACER_ABILITIES_BLINK',
                    icon: require('./assets/heroes/TRACER.ability.BLINK.png'),
                },
                {
                    code: 'TRACER_ABILITIES_RECALL',
                    icon: require('./assets/heroes/TRACER.ability.RECALL.png'),
                },
                {
                    code: 'TRACER_ABILITIES_PULSE_BOMB',
                    icon: require('./assets/heroes/TRACER.ability.PULSE_BOMB.png'),
                },
            ],
        },
        [Heroes.WIDOWMAKER]: {
            id: Heroes.WIDOWMAKER,
            code: 'WIDOWMAKER',
            color: '#9F6CA9',
            icon: require('./assets/heroes/WIDOWMAKER.icon.png'),
            portrait: require('./assets/heroes/WIDOWMAKER.portrait.png'),
            background: require('./assets/heroes/WIDOWMAKER.background.png'),
            role: Heroes.ROLE.DEFENSE,
            difficulty: 2,
            abilities: [
                {
                    code: 'WIDOWMAKER_ABILITIES_WIDOWS_KISS',
                    icon: require('./assets/heroes/WIDOWMAKER.ability.WIDOWS_KISS.png'),
                },
                {
                    code: 'WIDOWMAKER_ABILITIES_GRAPPLING_HOOK',
                    icon: require('./assets/heroes/WIDOWMAKER.ability.GRAPPLING_HOOK.png'),
                },
                {
                    code: 'WIDOWMAKER_ABILITIES_VENOM_MINE',
                    icon: require('./assets/heroes/WIDOWMAKER.ability.VENOM_MINE.png'),
                },
                {
                    code: 'WIDOWMAKER_ABILITIES_INFRA-SIGHT',
                    icon: require('./assets/heroes/WIDOWMAKER.ability.INFRA-SIGHT.png'),
                },
            ],
        },
        [Heroes.WINSTON]: {
            id: Heroes.WINSTON,
            code: 'WINSTON',
            color: '#A1A7BE',
            icon: require('./assets/heroes/WINSTON.icon.png'),
            portrait: require('./assets/heroes/WINSTON.portrait.png'),
            background: require('./assets/heroes/WINSTON.background.png'),
            role: Heroes.ROLE.TANK,
            difficulty: 2,
            abilities: [
                {
                    code: 'WINSTON_ABILITIES_TESLA_CANNON',
                    icon: require('./assets/heroes/WINSTON.ability.TESLA_CANNON.png'),
                },
                {
                    code: 'WINSTON_ABILITIES_JUMP_PACK',
                    icon: require('./assets/heroes/WINSTON.ability.JUMP_PACK.png'),
                },
                {
                    code: 'WINSTON_ABILITIES_BARRIER_PROJECTOR',
                    icon: require('./assets/heroes/WINSTON.ability.BARRIER_PROJECTOR.png'),
                },
                {
                    code: 'WINSTON_ABILITIES_PRIMAL_RAGE',
                    icon: require('./assets/heroes/WINSTON.ability.PRIMAL_RAGE.png'),
                },
            ],
        },
        [Heroes.ZARYA]: {
            id: Heroes.ZARYA,
            code: 'ZARYA',
            color: '#E87FB5',
            icon: require('./assets/heroes/ZARYA.icon.png'),
            portrait: require('./assets/heroes/ZARYA.portrait.png'),
            background: require('./assets/heroes/ZARYA.background.png'),
            role: Heroes.ROLE.TANK,
            difficulty: 3,
            abilities: [
                {
                    code: 'ZARYA_ABILITIES_PARTICLE_CANNON',
                    icon: require('./assets/heroes/ZARYA.ability.PARTICLE_CANNON.png'),
                },
                {
                    code: 'ZARYA_ABILITIES_PARTICLE_BARRIER',
                    icon: require('./assets/heroes/ZARYA.ability.PARTICLE_BARRIER.png'),
                },
                {
                    code: 'ZARYA_ABILITIES_PROJECTED_BARRIER',
                    icon: require('./assets/heroes/ZARYA.ability.PROJECTED_BARRIER.png'),
                },
                {
                    code: 'ZARYA_ABILITIES_GRAVITON_SURGE',
                    icon: require('./assets/heroes/ZARYA.ability.GRAVITON_SURGE.png'),
                },
            ],
        },
        [Heroes.ZENYATTA]: {
            id: Heroes.ZENYATTA,
            code: 'ZENYATTA',
            color: '#ECE581',
            icon: require('./assets/heroes/ZENYATTA.icon.png'),
            portrait: require('./assets/heroes/ZENYATTA.portrait.png'),
            background: require('./assets/heroes/ZENYATTA.background.png'),
            role: Heroes.ROLE.SUPPORT,
            difficulty: 3,
            abilities: [
                {
                    code: 'ZENYATTA_ABILITIES_ORB_OF_DESTRUCTION',
                    icon: require('./assets/heroes/ZENYATTA.ability.ORB_OF_DESTRUCTION.png'),
                },
                {
                    code: 'ZENYATTA_ABILITIES_ORB_OF_HARMONY',
                    icon: require('./assets/heroes/ZENYATTA.ability.ORB_OF_HARMONY.png'),
                },
                {
                    code: 'ZENYATTA_ABILITIES_ORB_OF_DISCORD',
                    icon: require('./assets/heroes/ZENYATTA.ability.ORB_OF_DISCORD.png'),
                },
                {
                    code: 'ZENYATTA_ABILITIES_TRANSCENDENCE',
                    icon: require('./assets/heroes/ZENYATTA.ability.TRANSCENDENCE.png'),
                },
            ],
        },
    };

    static get(id) {
        return Heroes.ITEMS[id];
    }
}
