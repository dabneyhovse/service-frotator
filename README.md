# DABNEY FROTATOR

_This README is under construction._

Frotator is a tool that Dabney Hovse uses to internally to keep track of
prefrosh during Rotation. It's implemented as a simple web app and designed to
be hosted on Dabney's server, Lenin, and accessed via
https://dabney.caltech.edu/frotator. Its primary purpose is to

- Collect Darbs' remarks on prefrosh during Rotation and organize them by
  dinner and dessert.
- Provide basic info about the prefrosh to rotating Darbs.
- Facilitate the Hovse in generating its List at Big Bad.

## NOTICES

- Frotator data should only be handled by rotating Darbs. This means that the
  Comptroller(s) who run Frotator should be rotating with Dabney, and that
  the Comptroller(s) should help remind the Hovse to use Frotator responsibly
  by not sharing the prefroshes' data with those who are not rotating with
  Dabney.
- Data for a given Rotation should be deleted once Rotation is over, and
  Frotator is generally only left running during Rotation.
- Any Darb is welcome to contribute to Frotator's code, though.

## SETUP

This section is a guide for setting Froshulator up for Rotation. Reference [the
next section](#guide-to-the-codebase) to get acquainted with the codebase (and
also probably a good idea to read some of the code, and update documentation
whilst you're at it winky face).

### RUNNING FROTATOR

The Frotator service is always online as it is a part of backbone, to run it
comptrollers only need to turn the service on via the admin panel

### SETUP CHECKLIST

- [ ] Upload Frosh data via admin panel.


## GUIDE TO THE CODEBASE

## CREDITS AND HISTORY

Amy Terry-Penak and Jesse Salomon wrote the first version in Python and PHP
around 2012--2013. The first version was kind of horrible, so Andrew Zhao wrote
the second version (a.k.a. Froshulorg) in Ruby on Rails in 2014. But nobody
except Andrew Zhao knew how to work with Ruby on Rails, so Tim Maxwell ported it
to Python in 2015. It is unclear what happened next, but eventually Nicholas
Currault made a bunch of improvements 2018--2019 (including starting this Git
repo), which led to the current version. In 2020 the Covid-19 pandemic hit,
delaying Rotation to the winter and forcing it onto the virtual medium. Thus,
Noah Ortiz made in 2021 some minor changes to accommodate the virtual Rotation,
updated the image scraper to work with a new version of Donut, and began to
update this documentation. In 2022 Froshulator was remade into Frotator with
node and react to work with the backbone server.

