import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).send(`
        <head>
          <meta http-equiv="refresh" content="0; url='http://localhost:3000/api-docs/'" />
        </head>
        <body>
          <h1><strong>MyRoute API</strong> is running</h1>
          <p><a href="./api-docs">See API documentation</a></p>
        </body>
      `);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
