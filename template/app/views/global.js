const global = {
  class: {
    input:
      "w-full rounded-md border border-input bg-background py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:ring-gray-400",
    btn: {
      default:
        "group flex gap-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 transition duration-200",

      get primary() {
        return `${this.default} bg-primary text-primary-foreground hover:bg-primary/90`;
      },

      get secondary() {
        return `${this.default} bg-secondary text-secondary-foreground hover:bg-secondary/90`;
      },

      get danger() {
        return `${this.default} bg-destructive text-destructive-foreground hover:bg-destructive/90`;
      },

      get black() {
        return `${this.default} bg-foreground text-background`;
      },
      get outline() {
        return `${this.default} text-foreground border border-input bg-transparent hover:bg-accent hover:text-accent-foreground`;
      },
    },
    icon: "text-muted-foreground w-4 h-4",
  },
  year: new Date().getFullYear(),
  appname: "LeadFlow",
};

module.exports = global;
