export function requireRole(role) {
  return (req, res, next) => {
    const user = req.user; // Asumiendo que el usuario ya está autenticado y disponible en req.user
    if (!user || user.role !== role) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}