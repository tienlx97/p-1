"use client";

import { useState } from "react";
import { Button } from "react-aria-components";
import { useMap } from "react-leaflet";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/features/map/constants/map.constants";
import { fitMapToCheckins } from "@/features/map/utils/map.utils";
import { cx } from "@/shared/lib/styles";

export function MapControls({ activeCheckin, visibleCheckins }) {
  const map = useMap();
  const [locationStatus, setLocationStatus] = useState("");

  function resetView() {
    if (activeCheckin) {
      map.flyTo([activeCheckin.latitude, activeCheckin.longitude], 13, { duration: 0.55 });
      return;
    }

    if (visibleCheckins.length === 1) {
      fitMapToCheckins(map, visibleCheckins);
      return;
    }

    map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.55 });
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setLocationStatus("Trình duyệt không hỗ trợ vị trí");
      return;
    }

    setLocationStatus("Đang lấy vị trí...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 14, { duration: 0.55 });
        setLocationStatus("Đã đến vị trí hiện tại");
      },
      () => {
        setLocationStatus("Chưa cấp quyền vị trí");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000
      }
    );
  }

  return (
    <div className={cx("explory-map-controls")} aria-label="Điều khiển bản đồ">
      <div className={cx("explory-control-group")}>
        <Button
          type="button"
          title="Phóng to"
          aria-label="Phóng to"
          onPress={() => map.zoomIn()}
        >
          +
        </Button>
        <span aria-hidden="true" />
        <Button
          type="button"
          title="Thu nhỏ"
          aria-label="Thu nhỏ"
          onPress={() => map.zoomOut()}
        >
          -
        </Button>
      </div>

      <div className={cx("explory-control-button")}>
        <Button type="button" title="Đưa về hành trình" aria-label="Đưa về hành trình" onPress={resetView}>
          <span className={cx("control-compass")} aria-hidden="true" />
        </Button>
      </div>

      <div className={cx("explory-control-button")}>
        <Button type="button" title="Vị trí hiện tại" aria-label="Vị trí hiện tại" onPress={locateUser}>
          <span className={cx("control-location")} aria-hidden="true" />
        </Button>
      </div>

      {locationStatus ? <p className={cx("explory-location-status")}>{locationStatus}</p> : null}
    </div>
  );
}
