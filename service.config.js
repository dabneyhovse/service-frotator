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
   *  OpenID Connect claims (as strings) that the user needs to view the service
   *  Administrators can create new roles and make roles from other clients visible
   *  to Backbone in the Keycloak admin console.
   */
  requiredClaims: ["frotator-access"],

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
