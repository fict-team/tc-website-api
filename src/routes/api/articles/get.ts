import { IRequest, IResponse, RequestMethod, Route, IQueryParameters } from "../../../core/api";
import { Article } from "../../../db/entities/Article";
import { check } from "express-validator";
import { buildOptionalQuery } from "../../../util/database";
import { Like } from "typeorm";

interface Query extends IQueryParameters {
  title?: string;
  skip?: string;
  take?: string;
}

/** GET /api/articles */
export default class extends Route {
  url = '/api/articles';
  method = RequestMethod.GET;
  async = true;
  validation = [
    check('title').optional({ nullable: true }).isString().notEmpty(),
    check('skip').optional({ nullable: true }).isInt(),
    check('take').optional({ nullable: true }).isInt(),
  ];

  async onRequest(req: IRequest<Query, any>, res: IResponse) {
    const dbQuery = buildOptionalQuery(req.query, 
      {
        skip: v => parseInt(v), 
        take: v => parseInt(v),
        where: {
          title: v => Like(v),
        }
      }
    );
  
    const articles = await Article.find(dbQuery) as Article[];
    res.status(200).json({ articles });
  }
};
