class Utils {
  // For primitive types
  static _string = (str = "") => {
    return {
      _value: str,
      capitalize: () => this._string(this.capitalize(str)),
      pluralize: () => this._string(this.pluralize(str)),
      singularize: () => this._string(this.singularize(str)),
      randomLetter: () => this.randomElement(arr),
    };
  };
  static _array = (arr = []) => {
    return {
      _value: arr,
      randomElement: () => this.randomElement(arr),
      toSet: () => this.uniqueArray(arr),
      difference: (arr2) => this.arrayDifference(arr, arr2),
    };
  };
  static _number = (n) => {
    return {
      _value: n,
      waitForMs: () => this.wait(n),
      random: (min = 0) => this.random(n, min),
      isRound: () => parseInt(n) == n,
    };
  };

  // Default methods
  static wait(ms = 1000) {
    return new Promise((res, rej) => {
      setTimeout(res, ms);
    });
  }
  static waitForPromises(...promises) {
    return new Promise(async (res, rej) => {
      promises = promises.map((p) => (typeof p == "function" ? p() : p));

      res(
        (await Promise.allSettled(promises)).map((v) =>
          v.status == "fulfilled" ? { value: v.value } : { err: v.reason }
        )
      );
    });
  }

  static random(max, min = 0) {
    return parseInt(Math.random() * (max - min)) + min;
  }

  static toMs({ d, h, m, s, ms }) {
    d = d ?? 0;
    h = h ?? 0;
    m = m ?? 0;
    s = s ?? 0;
    ms = ms ?? 0;

    const stamp = ms + (1000 * s) + (60 * 1000 * m) + (60 * 60 * 1000 * h) + (24 * 60 * 60 * 1000 * d)
    return stamp;
  }

  static randomElement(array) {
    if (typeof array == "string") array = array.split("");

    if (!Array.isArray(array) || array.length === 0) {
      throw new Error("Input must be a non-empty array");
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  static uniqueArray(arr) {
    return [...new Set(arr)];
  }

  static arrayDifference(arr1, arr2) {
    return arr1.filter((x) => !arr2.includes(x));
  }

  static generateRandomString(length = 10) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static capitalize(str = "") {
    if (typeof str !== "string") {
      throw new Error("Input must be a string");
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static pluralize(word = "") {
    if (word.endsWith("y") && !/[aeiou]y$/.test(word)) {
      return word.slice(0, -1) + "ies";
    } else if (
      word.endsWith("s") ||
      word.endsWith("x") ||
      word.endsWith("z") ||
      word.endsWith("sh") ||
      word.endsWith("ch")
    ) {
      return word + "es";
    } else if (word.endsWith("f")) {
      return word.slice(0, -1) + "ves";
    } else if (word.endsWith("fe")) {
      return word.slice(0, -2) + "ves";
    } else {
      return word + "s";
    }
  }

  static singularize(word = "") {
    if (word.endsWith("ies")) {
      return word.slice(0, -3) + "y";
    } else if (word.endsWith("ves")) {
      return word.slice(0, -3) + "f";
    } else if (
      word.endsWith("es") &&
      (word.endsWith("shes") || word.endsWith("ches"))
    ) {
      return word.slice(0, -2);
    } else if (word.endsWith("es")) {
      return word.slice(0, -2);
    } else if (word.endsWith("s") && !word.endsWith("ss")) {
      return word.slice(0, -1);
    } else {
      return word;
    }
  }
}

module.exports = Utils;
