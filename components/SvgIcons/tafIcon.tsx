import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const TAFIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#EA4335"
      d="M15 0H3C1.34 0 0 1.33 0 2.97v10.91c0 1.64 1.34 2.97 3 2.97h.76c.8 0 1.56.31 2.12.87l1.71 1.69c.78.77 2.05.77 2.83 0l1.71-1.69c.56-.56 1.33-.87 2.12-.87H15c1.66 0 3-1.33 3-2.97V2.97C18 1.33 16.66 0 15 0ZM9.28 12.96c-.15.05-.4.05-.56 0-1.3-.45-4.22-2.3-4.22-5.45C4.51 6.12 5.62 5 7 5c.82 0 1.54.39 2 1 .46-.61 1.18-1 2-1 1.38 0 2.5 1.12 2.5 2.51-.01 3.15-2.92 5-4.22 5.45Z"
    />
  </Svg>
)
export default TAFIcon
