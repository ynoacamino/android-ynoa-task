import profileImg from '@/../public/profile.png';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ title, back }: { title: string, back?: boolean }) {
  return (
    <div className="flex w-full justify-between p-4 items-center">
      <div className="flex gap-2 items-center">
        {back
        && (
        <Link to="/home" className="px-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <img
        src={profileImg}
        alt="profile-image"
        className="w-14 rounded-full"
      />
    </div>
  );
}
