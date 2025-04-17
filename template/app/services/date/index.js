const LangService = require("../lang");

/**
 * Service for handling date-related operations, such as formatting dates, adding time to dates,
 * comparing dates, and retrieving date information in different languages.
 */
class DateService {
  /**
   * Language-specific month names.
   * @type {object}
   * @private
   */
  static #monthsLang = {
    fr: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  };

  /**
   * Language-specific day names.
   * @type {object}
   * @private
   */
  static #daysLang = {
    fr: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    en: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  };

  /**
   * Retrieves the day, month, year, and time components of a date based on a timestamp.
   * @param {number} [timestamp=Date.now()] - The timestamp to retrieve date information from.
   * @returns {object} An object containing the day, month, year, and time components.
   * @example
   * {
   *   day: "Monday",
   *   month: "January",
   *   year: "2025",
   *   dayNum: "01",
   *   monthNum: "01",
   *   hours: "12",
   *   minutes: "30",
   *   seconds: "45"
   * }
   */
  static getDateInfo(timestamp = Date.now()) {
    const months = this.#monthsLang[LangService.getLang()];
    const days = this.#daysLang[LangService.getLang()];
    const date = new Date(timestamp);
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return {
      day,
      month,
      year,
      dayNum: dayNum.toString().padStart(2, "0"),
      monthNum: (date.getMonth() + 1).toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  }

  /**
   * Formats a date to a string representation based on a timestamp.
   * @param {number} timestamp - The timestamp to format.
   * @param {boolean} [withDay=false] - Whether to include the day of the week.
   * @param {boolean} [withTime=false] - Whether to include the time.
   * @returns {string} A formatted string representing the date.
   * @example
   * "Monday 01 January 2025, 12h30"
   */
  static strDate(timestamp, withDay = false, withTime = false) {
    const date = this.getDateInfo(timestamp);
    return `${withDay ? date.day + " " : ""}${date.dayNum} ${date.month} ${
      date.year
    }${withTime ? `, ${date.hours}h${date.minutes}` : ""}`;
  }

  /**
   * Converts a timestamp to a more readable date format (DD/MM/YYYY).
   * @param {number} timestamp - The timestamp to convert.
   * @returns {string} A formatted date string (DD/MM/YYYY).
   * @example
   * "01/01/2025"
   */
  static dateFromStamp(timestamp) {
    const date = this.getDateInfo(timestamp);
    return `${date.dayNum}/${date.monthNum}/${date.year}`;
  }

  /**
   * Converts a duration object into a timestamp (milliseconds).
   * @param {object} duration - The duration object containing time components.
   * @param {number} [duration.h=0] - Hours.
   * @param {number} [duration.s=0] - Seconds.
   * @param {number} [duration.m=0] - Minutes.
   * @param {number} [duration.ms=0] - Milliseconds.
   * @param {number} [duration.d=0] - Days.
   * @returns {number} The total time duration in milliseconds.
   * @example
   * DateService.toTimeStamp({ h: 1, m: 30 }) // returns 5400000 (1 hour 30 minutes)
   */
  static toTimeStamp({ h, s, m, ms, d }) {
    const d_to_ms = (d ?? 0) * 24 * 60 * 60 * 1000;
    const h_to_ms = (h ?? 0) * 60 * 60 * 1000;
    const m_to_ms = (m ?? 0) * 60 * 1000;
    const s_to_ms = (s ?? 0) * 1000;
    ms ??= 0;

    return d_to_ms + h_to_ms + m_to_ms + s_to_ms + ms;
  }

  /**
   * Adds a duration to a given date.
   * @param {object} duration - The duration object containing time components to add.
   * @param {Date} [date=new Date()] - The base date to add the duration to.
   * @returns {Date} The new date after adding the duration.
   * @example
   * DateService.addToDate({ h: 1, m: 30 }) // returns a date 1 hour and 30 minutes from now
   */
  static addToDate({ h, s, m, ms, d }, date = new Date()) {
    return new Date(date.getTime() + this.toTimeStamp({ h, s, m, ms, d }));
  }

  /**
   * Compares two dates.
   * @param {Date} d1 - The first date to compare.
   * @param {Date} d2 - The second date to compare.
   * @returns {number} Returns 0 if the dates are equal, -1 if d1 is before d2, or 1 if d1 is after d2.
   */
  static compare(d1, d2) {
    const t1 = d1.getTime();
    const t2 = d2.getTime();
    return t1 === t2 ? 0 : t1 < t2 ? -1 : 1;
  }

  /**
   * Checks if the first date is after the second date.
   * @param {Date} d1 - The first date to compare.
   * @param {Date} d2 - The second date to compare.
   * @returns {boolean} `true` if d1 is after d2, otherwise `false`.
   */
  static isAfter(d1, d2) {
    return this.compare(d1, d2) === 1;
  }

  /**
   * Checks if the first date is before the second date.
   * @param {Date} d1 - The first date to compare.
   * @param {Date} d2 - The second date to compare.
   * @returns {boolean} `true` if d1 is before d2, otherwise `false`.
   */
  static isBefore(d1, d2) {
    return this.compare(d1, d2) === -1;
  }

  /**
   * Checks if the given date is after the current date.
   * @param {Date} d1 - The date to compare with the current date.
   * @returns {boolean} `true` if d1 is after the current date, otherwise `false`.
   */
  static isAfterNow(d1) {
    const now = new Date();
    return this.isBefore(now, d1);
  }

  /**
   * Checks if the given date is before the current date.
   * @param {Date} d1 - The date to compare with the current date.
   * @returns {boolean} `true` if d1 is before the current date, otherwise `false`.
   */
  static isBeforeNow(d1) {
    const now = new Date();
    return this.isBefore(d1, now);
  }
}

module.exports = DateService;
