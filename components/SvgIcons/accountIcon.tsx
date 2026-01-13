import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const AccountIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#4285F4"
      d="M14.19 0H5.81C2.17 0 0 2.17 0 5.81v8.37C0 17.83 2.17 20 5.81 20h8.37c3.64 0 5.81-2.17 5.81-5.81V5.81C20 2.17 17.83 0 14.19 0Zm-.3 11.47a3.782 3.782 0 0 1-3.8.93l-1.06 1.05c-.09.09-.25.09-.35 0l-.97-.97a.387.387 0 0 0-.53 0c-.15.14-.14.38 0 .53l.97.97c.1.1.1.26 0 .35l-.41.41c-.17.18-.5.29-.74.26l-1.09-.15c-.36-.05-.69-.39-.75-.75l-.15-1.09c-.04-.24.08-.57.24-.74L7.6 9.92c-.4-1.3-.09-2.77.94-3.8 1.47-1.47 3.87-1.47 5.35 0a3.778 3.778 0 0 1 0 5.35Z"
    />
  </Svg>
)
export default AccountIcon
