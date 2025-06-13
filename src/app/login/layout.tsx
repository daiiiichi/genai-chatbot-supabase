export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-gray-50 min-h-screen antialiased">{children}</div>;
}
