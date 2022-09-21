module.exports = {
  /**
   * The name of the service, this is what you will see on the navbar dropdown of the main dabney website
   */
  name: "Frotator",

  /**
   * base name for any module imports
   *
   * main module is
   *  import example
   *
   * for submodules:
   *  import example/submodules/Admin
   */
  moduleName: "service-frotator",

  /**
   * A description of the service that will be given along with the name (above) on the services page
   */
  description:
    "Frotator helps rotating Darbs keep track of frosh during rotation. Note that only rotating Darbs (full members of Dabney Hovse who are rotating with Dabney Hovse) should access this service.",

  /**
   * if the service should be displayed in the navbar
   */
  displayInNav: true,

  /**
   * Describes what section the dropdown item appears in
   *
   * options are ("b","m","t")
   *
   * "b" => bottom
   * "m" => middle
   * "t" => top
   */
  dropdownItemPosition: "m",

  /**
   * Tool tip to display when hovering over the link in the services dropdown
   * try to keep the text short
   */
  tooltip: "Helps Darbs keep track of frosh during rotation.",

  /**
   *  Amount of authorization that the user needs to view the service
   *  possible values:
   *    -1 => prefrosh only                         (lol this isnt real we cant check)
   *    0 => no login required                      (or 1/2/3/4 reqs)
   *    1 => login required (non darbs can access)  (or 2/3/4 reqs)
   *    2 => login & socialDarb required            (or 3/4 reqs)
   *    3 => login & fullDarb required              (or 4 reqs)
   *    4 => admin status required
   *    5 => login but only non darbs
   *    6 => login but only social darbs
   *    7 => login but only full darbs
   *
   *  I'm not sure why someone would want the 5-7 settings but i'm including it
   *  just so every config is possible.
   */
  requiredAuth: 3,

  /**
   * Similar to before, but simply restricts to current students only.
   *
   * Yeah the current student status of users will be self declared in the
   * profile settings section, so I imagine itll be annoying to verify, but
   * comptrollers wil have easy access to change user statuses
   *
   * To avoid annoying debate later, yes I'm going to include students on leave
   * y'all can bicker about this however you want but its best to default to yes
   * and deal with exceptions later.
   */
  requireCurrentStudent: false,

  /**
   * the route you want your service to occupy ie "example" gives the service dabney.caltech.edu/example/*
   * simply use your own react router to get vaired routes from the base ie
   * dabney.caltech.edu/example/about and dabney.caltech.edu/example/home
   * would be two different routes
   */
  route: "frotator",

  /**
   * navlink type (href|react)
   *
   * href will be a normal link while react will use a link container
   */
  routeType: "react-router",

  /**
   * If backbone should try importing a sequelize db file
   * (expected format in /src/db/index.js)
   */
  importDb: true,

  /**
   * If backbone should try importing a react component (note that this should be true if a displayInNav is true)
   * (expected format in /src/client/index.js)
   */
  importReact: true,

  /**
   * If backbone should try importing an express backend
   * (expected format in /src/server/index.js)
   */
  importExpress: true,

  /**
   * If Backbone should try importing react admin panel.
   */
  importAdmin: true,

  /**
   * If Backbone shoud try importing redux
   */
  importRedux: true,
};
