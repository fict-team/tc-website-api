import { IRequest, IResponse, RequestMethod, Route } from "../../../core/api";
import authentication from "../../../middlewares/authentication";
import { UserPermission } from "../../../db/entities/User";
import { News } from "../../../db/entities/News";
import { check } from "express-validator";
import { RequestError } from '../../../util/errors';

interface Body {
  title: string;
  content: string;
  visible?: boolean;
  urlAlias?: string;
}

/** PUT /api/news */
export default class extends Route {
  url = '/api/news';
  method = RequestMethod.PUT;
  async = true;
  validation = [
    check('title').isString().notEmpty(),
    check('content').isString().notEmpty(),
    check('path').optional().isString().notEmpty(),
    check('visible').optional().isBoolean(),
  ];
  middlewares = [authentication({ required: true, permissions: [UserPermission.MANAGE_NEWS] })];

  async onRequest(req: IRequest<any, Body>, res: IResponse) {
    const { title, content, visible = true, urlAlias = null } = req.body;

    const existingNews = await News.findOne({ 
      where: [
        { id: parseInt(urlAlias) ?? 0 },
        { urlAlias },
      ],
    });

    if (existingNews) {
      throw new RequestError(
        'News post with given urlAlias already exists.', 
        403, 
        [
          existingNews.id.toString(), 
          existingNews.title, 
          existingNews.urlAlias
        ]
      );
    }
  }
};
