import { Request, Response } from "express";

export class TypeMiddleware {
  static validTypes(validTypes: string[]) {
    return (req: Request, res: Response, next: Function) => {
      const type = req.url.split('/').at(2) || '';

      if (!validTypes.includes(type)) {
        return res
          .status(400)
          .json({
            error: `Type ${type} not allowed, valid ones ${validTypes}`,
          });
      }
      next();
    };
  }
}
