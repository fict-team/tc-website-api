import { IRequest, IResponse, RequestMethod, Route } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission } from "../../../db/entities/User";
import { Article } from "../../../db/entities/Article";
import { check } from "express-validator";
import { LocalizedContent } from "../../../core/language";
import { isValidLocalizedContent } from "../../../core/language";

interface Body {
  title: string;
  content: LocalizedContent<string>;
  visible?: boolean;
  publishAt?: number;
  telegramFeed?: boolean;
}

/** PUT /api/articles */
export default class extends Route {
  url = '/api/articles';
  method = RequestMethod.PUT;
  async = true;
  validation = [
    check('title').isString().notEmpty(),
    check('visible').optional({ nullable: true }).isBoolean(),
    check('publishAt').optional({ nullable: true }).isInt(),
    check('telegramFeed').optional({ nullable: true }).isBoolean(),
    check('content')
      .custom((content: LocalizedContent<string>) => isValidLocalizedContent(content, (v) => typeof(v) === 'string'))
      .withMessage('Invalid localized content'),
  ];
  middlewares = [authentication({ required: true, permissions: [UserPermission.MANAGE_ARTICLES] })];

  async onRequest(req: IRequest<any, Body>, res: IResponse) {
    const { title, publishAt = Date.now(), content, visible = true, telegramFeed = false } = req.body;

    const article = await Article.create({
      title,
      content,
      visible,
      publishedAt: new Date(publishAt),
    }).save();

    res.status(200).json({ article });
  }
};
