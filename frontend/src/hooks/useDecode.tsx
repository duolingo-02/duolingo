import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

// Interface pour typer les données du token déchiffré
interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any; // Ajouter d'autres propriétés spécifiques si nécessaire
}

// Custom hook pour déchiffrer un token JWT depuis le localStorage
export const useDecodeToken = (): DecodedToken | null => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  useEffect(() => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Token invalide ou erreur de déchiffrement:", error);
        setDecodedToken(null);
      }
    }
  }, []); // Exécuter seulement au montage du composant

  return decodedToken;
};
