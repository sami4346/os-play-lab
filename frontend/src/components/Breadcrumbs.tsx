import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    pathnames.forEach((path, index) => {
      const route = `/${pathnames.slice(0, index + 1).join('/')}`;
      let label = path.charAt(0).toUpperCase() + path.slice(1);
      
      // Special cases for better labels
      switch(path) {
        case 'chat':
          label = 'OS Learning Assistant';
          break;
        case 'learn':
          label = 'Learning Materials';
          break;
        case 'settings':
          label = 'Settings';
          break;
        case 'help':
          label = 'Help & Support';
          break;
      }
      
      breadcrumbs.push({ label, path: route });
    });

    // Don't show breadcrumbs if we're on the home page
    return breadcrumbs.length > 1 ? breadcrumbs : [];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="space-y-4 mb-6">
      {/* Navigation Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav 
          aria-label="Breadcrumb navigation"
          className="flex items-center space-x-1 text-sm text-muted-foreground"
        >
          <ol className="flex items-center space-x-1">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.path} className="flex items-center">
                {index === 0 ? (
                  <Link
                    to={breadcrumb.path}
                    className="flex items-center hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm p-1 interactive"
                    aria-label={breadcrumb.label}
                  >
                    <Home className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
                    )}
                    <Link
                      to={breadcrumb.path}
                      className={`hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1 interactive ${
                        index === breadcrumbs.length - 1 
                          ? 'text-foreground font-medium' 
                          : ''
                      }`}
                      aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                    >
                      {breadcrumb.label}
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
};

export default Breadcrumbs;
