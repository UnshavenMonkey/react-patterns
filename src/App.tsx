import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import "./App.css";
import CanProxy, {
  type CurrentUser,
  type Permission,
} from "./examples/Render props/CanProxy";
import CounterPanel from "./examples/destructuring/useState";
import Notice from "./examples/destructuring/spred_example";
import ToggleSwitch from "./examples/destructuring/switch";
import ProtectedRoute, {
  type Session,
} from "./examples/function_as_children_examples/ProtectedRoute";

const currentUser: CurrentUser = {
  name: "John",
  permissions: ["admin", "viewer"],
};

const session: Session = {
  token: "lesson-token",
  userName: currentUser.name,
};

const UserContext = createContext<CurrentUser | null>(null);

const useCurrentUser = () => {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("useCurrentUser must be used inside UserContext.Provider");
  }

  return user;
};

type PatternSectionProps = {
  title: string;
  patterns: string[];
  children: ReactNode;
};

const PatternSection = ({ title, patterns, children }: PatternSectionProps) => (
  <section className="pattern-section">
    <div className="section-copy">
      <h2>{title}</h2>
      <ul>
        {patterns.map((pattern) => (
          <li key={pattern}>{pattern}</li>
        ))}
      </ul>
    </div>
    <div className="section-demo">{children}</div>
  </section>
);

const withPatternFrame = <Props extends object>(
  Component: ComponentType<Props>,
  label: string,
) => {
  return function PatternFrame(props: Props) {
    return (
      <div className="framed-demo">
        <p className="eyebrow">{label}</p>
        <Component {...props} />
      </div>
    );
  };
};

type PermissionButtonProps = {
  permission: Permission;
  children: ReactNode;
};

const PermissionButton = ({ permission, children }: PermissionButtonProps) => {
  const user = useCurrentUser();

  return (
    <CanProxy permission={permission} user={user} fallback={<p>No access</p>}>
      {({ disabled, allowed }) => (
        <button type="button" disabled={disabled}>
          {allowed ? children : "Unavailable"}
        </button>
      )}
    </CanProxy>
  );
};

const FramedPermissionButton = withPatternFrame(
  PermissionButton,
  "Higher-order component",
);

type Action = "save" | "reset" | "archive";

const actionMessages: Record<Action, string> = {
  save: "Draft saved",
  reset: "Form reset",
  archive: "Moved to archive",
};

function App() {
  const [count, setCount] = useState(5);
  const [step, setStep] = useState(1);
  const [enabled, setEnabled] = useState(true);
  const [lastAction, setLastAction] = useState<Action>("save");
  const userValue = useMemo(() => currentUser, []);

  const handleAction = (action: Action) => {
    switch (action) {
      case "save":
      case "reset":
      case "archive":
        setLastAction(action);
        break;
    }
  };

  return (
    <UserContext.Provider value={userValue}>
      <main className="app-shell">
        <header className="app-header">
          <p className="eyebrow">React patterns homework</p>
          <h1>Five refactored components</h1>
          <p>
            The examples are composed into one screen so state, props, children,
            render props, proxy components and HOCs can be checked together.
          </p>
        </header>

        <PatternSection
          title="Controlled counter"
          patterns={["state hoisting", "controlled input", "destructuring props"]}
        >
          <CounterPanel
            count={count}
            step={step}
            onCountChange={setCount}
            onStepChange={setStep}
          />
        </PatternSection>

        <PatternSection
          title="Reusable notice"
          patterns={[
            "JSX spread attributes",
            "merge destructured props",
            "conditional rendering",
            "array as children",
          ]}
        >
          <Notice
            title="Spread props example"
            tone={enabled ? "success" : "warning"}
            aria-live="polite"
            actions={[
              <button key="save" type="button" onClick={() => handleAction("save")}>
                Save
              </button>,
              <button
                key="archive"
                type="button"
                onClick={() => handleAction("archive")}
              >
                Archive
              </button>,
            ]}
          >
            <p>{actionMessages[lastAction]}</p>
            <p>Counter value is {count}.</p>
          </Notice>
        </PatternSection>

        <PatternSection
          title="Styled switch"
          patterns={["proxy component", "style component", "event switch"]}
        >
          <ToggleSwitch
            checked={enabled}
            label="Enable dashboard actions"
            variant={enabled ? "switch" : "border-bottom"}
            onChange={(event) => {
              setEnabled(event.target.checked);
              handleAction(event.target.checked ? "save" : "reset");
            }}
          />
        </PatternSection>

        <PatternSection
          title="Access proxy"
          patterns={["function as children", "render prop", "children types"]}
        >
          <FramedPermissionButton permission="admin">
            Open admin panel
          </FramedPermissionButton>
        </PatternSection>

        <PatternSection
          title="Protected content"
          patterns={["children pass-through", "context", "conditional rendering"]}
        >
          <ProtectedRoute
            session={session}
            fallback={<Notice title="Login required" tone="warning" />}
          >
            {({ userName }) => (
              <Notice title={`Welcome, ${userName}`} tone="info">
                <p>Secure content is rendered through function-as-children.</p>
              </Notice>
            )}
          </ProtectedRoute>
        </PatternSection>
      </main>
    </UserContext.Provider>
  );
}

export default App;
