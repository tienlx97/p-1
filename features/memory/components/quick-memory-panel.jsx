"use client";

import { useState } from "react";
import { Button, Input, Link } from "react-aria-components";
import { moods } from "@/entities/memory";
import { Field, SelectField, SelectItem, TextAreaField } from "@/shared/components/ui";

import { cx } from "@/shared/lib/styles";

export function QuickMemoryPanel({ embedded = false }) {
  const [saved, setSaved] = useState(false);
  const [locationName, setLocationName] = useState("Quán nhỏ tụi mình thích");
  const [coordinates, setCoordinates] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setCoordinates("Trình duyệt không hỗ trợ vị trí");
      return;
    }

    setCoordinates("Đang lấy vị trí hiện tại...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nextCoordinates = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setCoordinates(nextCoordinates);
        setGoogleMapsUrl(`https://maps.google.com/?q=${nextCoordinates}`);
      },
      () => {
        setCoordinates("Chưa cấp quyền vị trí");
      }
    );
  }

  return (
    <form
      className={cx("quick-memory-panel")}
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      {embedded ? null : (
        <div className={cx("panel-heading")}>
          <div>
            <p className={cx("eyebrow")}>Thêm nhanh</p>
            <h2>Kỷ niệm mới</h2>
          </div>
          <Link href="/checkins/new" className={cx("text-link")}>
            Form đầy đủ
          </Link>
        </div>
      )}

      <label className={cx("quick-upload")} htmlFor="quick-photos">
        <Input id="quick-photos" type="file" accept="image/*,video/*" multiple />
        <span aria-hidden="true">+</span>
        <strong>Thêm ảnh hoặc video</strong>
      </label>

      <Field isRequired label="Tiêu đề *" defaultValue="Một buổi chiều đáng nhớ" />

      <div className={cx("field-grid compact")}>
        <Field isRequired label="Ngày *" type="date" defaultValue="2026-05-15" />

        <SelectField label="Cảm xúc" defaultSelectedKey="memorable">
          {moods.map((mood) => (
            <SelectItem id={mood.id} key={mood.id}>
              {mood.name}
            </SelectItem>
          ))}
        </SelectField>
      </div>

      <Field label="Địa điểm" value={locationName} onChange={setLocationName} />

      <div className={cx("field-grid compact")}>
        <Field label="Tọa độ" value={coordinates} onChange={setCoordinates} />
        <Field label="URL Google Maps" type="url" value={googleMapsUrl} onChange={setGoogleMapsUrl} />
      </div>

      <TextAreaField label="Ghi chú" rows={4} defaultValue="Điều mình muốn nhớ nhất là..." />

      <div className={cx("quick-actions")}>
        <Button className={cx("btn btn-primary")} type="submit">
          <span aria-hidden="true">+</span>
          Lưu kỷ niệm
        </Button>
        <Button className={cx("btn btn-secondary")} type="button" onPress={useCurrentLocation}>
          <span aria-hidden="true">⌖</span>
          Vị trí hiện tại
        </Button>
      </div>

      {saved ? <p className={cx("save-state")}>Đã lưu bản nháp trên màn hình.</p> : null}
    </form>
  );
}
