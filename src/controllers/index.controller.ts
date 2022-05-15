import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).send(`
        <p><strong>MyRoute API</strong> is running</p>
        <p><a href="./api-docs">See API documentación</a></p>
      `);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
