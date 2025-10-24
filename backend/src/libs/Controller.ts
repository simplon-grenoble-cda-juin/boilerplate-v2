import { Request, Response } from "express";

export abstract class Controller {
  // Requête HTTP reçue
  protected request: Request;
  // Réponse HTTP à envoyer
  protected response: Response;

  /**
   * Initialise le contrôleur avec la requête et la réponse
   */
  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }
}
