const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
// GET api/profile/me    returns current user profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile" });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
// Post api/profile Create or Update user profile.

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object.
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());

      // CREATE SOCIAL OBJECT FOR PROFILE>!
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (instagram) profileFields.social.instagram = instagram;

      try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
          profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        }
        // No profile Found.
        profile = new Profile(profileFields);
        await profile.save();

        res.json(profile);
      } catch (e) {
        res.status(500).send("Server Error");
      }
    }
  }
);
//GET api/profile    - Get all profiles

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate("user", [
      "name",
      "avatar"
    ]);

    res.send(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//  api/profile/user/:user_id   Get profile by UserId
router.get("/user/:user_id", async (req, res) => {
  const id = req.params.id;
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.status(400).json({ msg: "No profile for this user" });

    res.send(profile);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// api/profile DELETE PROFILE AND USER !
router.delete("/", auth, async (req, res) => {
  try {
    // todo - user post remove
    await Post.deleteMany({ user: req.user.id });
    // REMOVE PROFILE  && USER
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// EXPERIENCE && EDUCATION SECTION. ==============

// api/profile/experience       ADD EXPERIENCE TO PROFILE

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty()
      // check("from", "From date is required")
      //   .not()
      //   .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

//   api/profile/experience/:exp_id    DELETE EXPERIENCE FROM PROFILE

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const idToDelete = req.params.exp_id;
    const experiences = profile.experience;

    const newExp = experiences.filter(item => item.id !== idToDelete);
    profile.experience = newExp;
    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// EDUCATION ==================
// api/profile/education       ADD EDUCATION TO PROFILE
router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required")
        .not()
        .isEmpty(),
      check("degree", "degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "fieldofstudy is required")
        .not()
        .isEmpty(),
      check("from", "from is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status.send(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      return res.json(profile);
    } catch (e) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

// // api/profile/education/:edu_id       Delete EDUCATION from PROFILE

router.delete("/education/:edu_id", auth, async (req, res) => {
  const eduId = req.params.edu_id;
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const education = profile.education;
    const newEdu = education.filter(item => item.id !== eduId);
    profile.education = newEdu;
    await profile.save();

    return res.json(profile);
  } catch (e) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// GET api/profile/github/:username

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
