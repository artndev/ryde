import { icons } from '@/constants'
import { cn } from '@/lib/utils'
import { Tabs } from 'expo-router'
import { Image, ImageSourcePropType, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType
  focused: boolean
}) => (
  <View
    className={cn(
      'flex items-center justify-center size-14 rounded-full',
      focused && 'bg-general-400'
    )}
  >
    <Image
      source={source}
      tintColor="white"
      resizeMode="contain"
      className="w-7 h-7"
    />
  </View>
)

const Layout = () => {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#333333',
          borderRadius: 50,
          overflow: 'hidden',
          marginHorizontal: 20,
          marginBottom: 20,
          height: 80,
          paddingBottom: insets.bottom,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          flexDirection: 'row',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: 'Rides',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.list} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.chat} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.profile} />
          ),
        }}
      />
    </Tabs>
  )
}

export default Layout
