import "../css/style.css";
import CommonLayout from "../(withHeader)/componets/common/CommonLayout";

export const metadata = {
  title: "Admin",
  description: "Admin panel",
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
  );
}
