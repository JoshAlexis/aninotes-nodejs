const Joi = require('joi');

const pixivSchema = Joi.object().keys({
  idPixiv: Joi.string().regex(/[0-1]{1,}/).required(),
  pixivName: Joi.string(),
  Content: Joi.string().required(),
  Quality: Joi.string().regex(/[+]/).min(1).max(4)
    .required(),
  Favorite: Joi.string().regex(/[F]{1,2}[+]{0,1}/).max(3).required(),
  Link: Joi.string().regex(/https:\/\/www.pixiv.net\/en\/users\/[0-9]{1,}/).required(),
});

const pixivContent = Joi.object().keys({
  Content: Joi.string().required(),
});

module.exports = {
  pixivSchema,
  pixivContent,
};
