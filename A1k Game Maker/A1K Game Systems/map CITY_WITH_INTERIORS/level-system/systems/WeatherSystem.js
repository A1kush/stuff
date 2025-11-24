/**
 * WeatherSystem.js - Dynamic Weather & Environmental Effects
 * @version 1.0.0
 * @description Weather conditions affecting gameplay, bonuses, and atmosphere
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.WeatherSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // WEATHER TYPES (20 Conditions)
  // ============================

  const WEATHER_TYPES = {
    // Common Weather (8)
    clear: {
      id: "clear",
      name: "Clear Skies",
      icon: "☀️",
      rarity: "common",
      probability: 0.35,
      duration: [1800000, 3600000], // 30min - 1hr
      effects: {
        visibility: 1.0,
        movement: 1.0,
      },
      bonuses: {},
    },
    cloudy: {
      id: "cloudy",
      name: "Cloudy",
      icon: "☁️",
      rarity: "common",
      probability: 0.25,
      duration: [3600000, 7200000],
      effects: {
        visibility: 0.9,
      },
      bonuses: {},
    },
    rain: {
      id: "rain",
      name: "Light Rain",
      icon: "🌧️",
      rarity: "common",
      probability: 0.15,
      duration: [1800000, 3600000],
      effects: {
        visibility: 0.8,
        fire_damage: 0.8,
        water_damage: 1.2,
      },
      bonuses: {
        herb_spawn: 1.5,
      },
    },
    fog: {
      id: "fog",
      name: "Dense Fog",
      icon: "🌫️",
      rarity: "uncommon",
      probability: 0.1,
      duration: [1800000, 3600000],
      effects: {
        visibility: 0.5,
        accuracy: 0.8,
      },
      bonuses: {
        ambush_damage: 1.5,
      },
    },
    snow: {
      id: "snow",
      name: "Snowfall",
      icon: "❄️",
      rarity: "uncommon",
      probability: 0.08,
      duration: [3600000, 7200000],
      effects: {
        movement: 0.8,
        ice_damage: 1.3,
        fire_damage: 0.7,
      },
      bonuses: {
        ice_res: 1.2,
      },
    },
    wind: {
      id: "wind",
      name: "Strong Wind",
      icon: "💨",
      rarity: "common",
      probability: 0.12,
      duration: [1800000, 3600000],
      effects: {
        projectile_speed: 1.5,
        movement: 1.1,
      },
      bonuses: {
        wind_damage: 1.3,
      },
    },
    heatwave: {
      id: "heatwave",
      name: "Heat Wave",
      icon: "🌡️",
      rarity: "uncommon",
      probability: 0.07,
      duration: [3600000, 7200000],
      effects: {
        fire_damage: 1.4,
        ice_damage: 0.6,
      },
      bonuses: {
        burn_chance: 1.5,
      },
    },
    storm: {
      id: "storm",
      name: "Thunderstorm",
      icon: "⛈️",
      rarity: "rare",
      probability: 0.05,
      duration: [1800000, 3600000],
      effects: {
        lightning_damage: 1.5,
        visibility: 0.6,
      },
      bonuses: {
        shock_chance: 1.8,
        xp: 1.2,
      },
    },

    // Rare Weather (7)
    blizzard: {
      id: "blizzard",
      name: "Blizzard",
      icon: "🌨️",
      rarity: "rare",
      probability: 0.03,
      duration: [1800000, 3600000],
      effects: {
        movement: 0.5,
        visibility: 0.4,
        ice_damage: 1.8,
      },
      bonuses: {
        freeze_chance: 2.0,
        xp: 1.3,
      },
    },
    sandstorm: {
      id: "sandstorm",
      name: "Sandstorm",
      icon: "🌪️",
      rarity: "rare",
      probability: 0.03,
      duration: [1800000, 3600000],
      effects: {
        visibility: 0.3,
        accuracy: 0.7,
      },
      bonuses: {
        earth_damage: 1.5,
        treasure_spawn: 1.8,
      },
    },
    aurora: {
      id: "aurora",
      name: "Aurora Borealis",
      icon: "🌌",
      rarity: "rare",
      probability: 0.02,
      duration: [7200000, 14400000],
      effects: {
        magic_damage: 1.4,
      },
      bonuses: {
        xp: 1.5,
        rare_drop: 1.5,
        mana_regen: 2.0,
      },
    },
    meteor_shower: {
      id: "meteor_shower",
      name: "Meteor Shower",
      icon: "☄️",
      rarity: "epic",
      probability: 0.01,
      duration: [900000, 1800000],
      effects: {
        random_damage: 50,
      },
      bonuses: {
        xp: 2.0,
        gold: 2.0,
        rare_drop: 2.0,
      },
    },

    // Epic Weather (5)
    blood_rain: {
      id: "blood_rain",
      name: "Blood Rain",
      icon: "🩸",
      rarity: "epic",
      probability: 0.008,
      duration: [1800000, 3600000],
      effects: {
        lifesteal: 0.2,
      },
      bonuses: {
        xp: 2.5,
        vampire_spawn: 5.0,
      },
    },
    eclipse: {
      id: "eclipse",
      name: "Solar Eclipse",
      icon: "🌑",
      rarity: "epic",
      probability: 0.005,
      duration: [1800000, 3600000],
      effects: {
        dark_damage: 2.0,
        light_damage: 0.5,
      },
      bonuses: {
        xp: 3.0,
        boss_spawn: 3.0,
      },
    },
    reality_storm: {
      id: "reality_storm",
      name: "Reality Storm",
      icon: "🌀",
      rarity: "legendary",
      probability: 0.001,
      duration: [900000, 1800000],
      effects: {
        all_damage: 2.0,
        chaos: true,
      },
      bonuses: {
        xp: 5.0,
        gold: 5.0,
        drop_rate: 5.0,
      },
    },
    divine_light: {
      id: "divine_light",
      name: "Divine Light",
      icon: "✨",
      rarity: "legendary",
      probability: 0.001,
      duration: [1800000, 3600000],
      effects: {
        holy_damage: 3.0,
        heal_all: 100,
      },
      bonuses: {
        xp: 10.0,
        gold: 10.0,
        legendary_drop: 10.0,
      },
    },
    apocalypse_weather: {
      id: "apocalypse_weather",
      name: "Apocalypse",
      icon: "🔥💀",
      rarity: "mythic",
      probability: 0.0001,
      duration: [900000, 1800000],
      effects: {
        all_damage: 5.0,
        danger: 10.0,
      },
      bonuses: {
        xp: 100.0,
        gold: 100.0,
        drop_rate: 100.0,
      },
    },
  };

  const WEATHER_KEYS = Object.keys(WEATHER_TYPES);

  // ============================
  // WEATHER SYSTEM CLASS
  // ============================

  class WeatherSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          autoChange: true,
          changeInterval: 1800000, // 30 minutes
          eventBus: null,
          debug: false,
        },
        options
      );

      this.currentWeather = "clear";
      this.weatherStartTime = Date.now();
      this.weatherEndTime = Date.now() + 3600000;

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      // Set initial weather
      this.changeWeather();

      // Auto-change weather
      if (this.options.autoChange) {
        setInterval(() => this.changeWeather(), this.options.changeInterval);
      }

      this.initialized = true;
      this._emit("weather:ready");

      return this;
    }

    /**
     * Change to new weather
     * @param {string} [weatherId] - Specific weather (optional)
     * @returns {Object} Weather data
     */
    changeWeather(weatherId = null) {
      const newWeather = weatherId || this._rollWeather();
      const weatherData = WEATHER_TYPES[newWeather];

      if (!weatherData) return null;

      this.currentWeather = newWeather;
      this.weatherStartTime = Date.now();

      const duration = this._randomRange(
        weatherData.duration[0],
        weatherData.duration[1]
      );
      this.weatherEndTime = Date.now() + duration;

      this._emit("weather:changed", {
        weather: newWeather,
        data: weatherData,
        duration,
      });

      return weatherData;
    }

    /**
     * Get current weather effects
     * @returns {Object} Effects & bonuses
     */
    getCurrentWeather() {
      const weatherData = WEATHER_TYPES[this.currentWeather];

      return {
        id: this.currentWeather,
        ...weatherData,
        remaining: Math.max(0, this.weatherEndTime - Date.now()),
      };
    }

    /**
     * Get weather bonuses
     * @returns {Object} Bonuses
     */
    getWeatherBonuses() {
      const weatherData = WEATHER_TYPES[this.currentWeather];
      return weatherData ? weatherData.bonuses : {};
    }

    /**
     * Get weather effects
     * @returns {Object} Effects
     */
    getWeatherEffects() {
      const weatherData = WEATHER_TYPES[this.currentWeather];
      return weatherData ? weatherData.effects : {};
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        currentWeather: this.currentWeather,
        weatherStartTime: this.weatherStartTime,
        weatherEndTime: this.weatherEndTime,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.currentWeather = data.currentWeather || "clear";
      this.weatherStartTime = data.weatherStartTime || Date.now();
      this.weatherEndTime = data.weatherEndTime || Date.now() + 3600000;

      this._emit("weather:loaded");
    }

    // Private methods
    _rollWeather() {
      const roll = Math.random();
      let cumulative = 0;

      for (const weather of Object.values(WEATHER_TYPES)) {
        cumulative += weather.probability;

        if (roll <= cumulative) {
          return weather.id;
        }
      }

      return "clear";
    }

    _randomRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[WeatherSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  WeatherSystem.WEATHER_TYPES = WEATHER_TYPES;
  WeatherSystem.WEATHER_KEYS = WEATHER_KEYS;

  return WeatherSystem;
});

