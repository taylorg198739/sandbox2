export const OBJECT_TYPE: any = {
  ACCESS: 'access',
  WIRELESS_ACCESS_POINT: 'wireless-access-point',
  WAVESURF: 'wavesurf',
  DISTRIBUTION: 'distribution',
  FIREWALL: 'firewall',
  ROUTER: 'router'
}

export const OBJECT_CONFIG: any = {
  "firewall" : {
    width: 8,
    height: 2,
    zHeight: 7,
    imageWidth: 90,
    imageHeight: 134,
    type: 'firewall',
    level: 0,
    originPoint: {
      x: 22, y: 85
    },
    points: {
      bottom: {
        x: 34, y: 112
      },
      top: {
        x: 83, y: 86
      },
      left: {
        x: 6, y: 82
      },
      right: {
        x: 76, y: 126
      }
    }
  },
  "router" : {
    width: 8,
    height: 8,
    zHeight: 6,
    imageWidth: 130,
    imageHeight: 132,
    type: OBJECT_TYPE.ROUTER,
    level: 1,
    originPoint: {
      x: 64, y: 50
    },
    points: {
      bottom: {
        x: 22, y: 120
      },
      right: {
        x: 107, y: 119
      },
      top: {
        x: 126, y: 64
      },
      left: {
        x: 2, y: 64
      }
    }
  },
  "distribution" : {
    width: 6,
    height: 3,
    zHeight: 7,
    imageWidth: 98,
    imageHeight: 131,
    type: OBJECT_TYPE.DISTRIBUTION,
    level: 2,
    originPoint: {
      x: 33, y: 76
    },
    points: {
      bottom: {
        x: 34, y: 112
      },
      top: {
        x: 94, y: 76
      },
      right: {
        x: 73, y: 123
      },
      left: {
        x: 2, y: 80
      }
    }
  },
  "access" : {
    type: OBJECT_TYPE.ACCESS,
    width: 4,
    height: 4,
    zHeight: 1,
    imageWidth: 88,
    imageHeight: 65,
    level: 3,
    originPoint: {
      x: 44,
      y: 13
    },
    points: {
      bottom: {
        x: 22, y: 49
      }, 
      right: {
        x: 66, y: 49
      },
      left: {
        x: 14, y: 18
      },
      top: {
        x: 75, y: 18
      }
    }
  },
  "wavesurf" : {
    type: OBJECT_TYPE.WAVESURF,
    width: 4,
    height: 4,
    zHeight: 1,
    imageWidth: 88,
    imageHeight: 65,
    level: 1,
    originPoint: {
      x: 44,
      y: 13
    },
    points: {
      bottom: {
        x: 22, y: 49
      }, 
      right: {
        x: 66, y: 49
      },
      left: {
        x: 14, y: 18
      },
      top: {
        x: 75, y: 18
      }
    }
  },
  "wireless-access-point" : {
    type: OBJECT_TYPE.WIRELESS_ACCESS_POINT,
    width: 3,
    height: 2,
    zHeight: 1,
    imageWidth: 56,
    imageHeight: 60,
    level: 4,
    originPoint: {
      x: 22, y: 29
    },
    points: {
      bottom: {
        x: 22, y: 53
      }, 
      right: {
        x: 42, y: 53
      },
      top: {
        x: 50, y: 36
      },
      left: {
        x: 6, y: 30
      }
    }
  }
}
